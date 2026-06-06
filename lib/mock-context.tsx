'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AppState, Incident, AuditLogEntry, Firm } from './mock-data';
import { INITIAL_STATE, generateId } from './mock-data';

const STORAGE_KEY = 'blotterhq_state';

interface MockContextValue {
  state: AppState;
  // Auth
  login: (email: string) => void;
  signup: (firmName: string, email: string) => void;
  logout: () => void;
  // Incidents
  confirmIncident: (id: string, updates: Partial<Incident>) => void;
  discardIncident: (id: string, reason: string) => void;
  logManualIncident: (data: Omit<Incident, 'id' | 'firmId' | 'createdAt' | 'updatedAt' | 'status' | 'retentionTier' | 'archivedAt' | 'sms48hrSent' | 'sms48hrSentAt'>) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  markCustomerNotified: (id: string) => void;
  // Nudge
  acknowledgeNudge: (nudgeId: string) => void;
  // Onboarding
  completeOnboarding: () => void;
  // Firm
  updateFirm: (updates: Partial<Firm>) => void;
  // Stats helpers
  getPendingIncidents: () => Incident[];
  getConfirmedIncidents: () => Incident[];
  getActiveVendorBreaches: () => Incident[];
  getIncidentsThisMonth: () => Incident[];
  getIncidentsThisYear: () => Incident[];
}

const MockContext = createContext<MockContextValue | null>(null);

export function useMockData(): MockContextValue {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error('useMockData must be used within MockDataProvider');
  return ctx;
}

function loadState(): AppState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Corrupted storage, reset
  }
  return INITIAL_STATE;
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full, ignore
  }
}

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  // Persist on state change
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const login = useCallback((email: string) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      firm: { ...prev.firm, ownerEmail: email },
    }));
  }, []);

  const signup = useCallback((firmName: string, email: string) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      onboardingComplete: false,
      firm: {
        ...prev.firm,
        name: firmName,
        ownerEmail: email,
        onboardingCompletedAt: null,
        firstIncidentLoggedAt: null,
      },
    }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isAuthenticated: false }));
  }, []);

  const confirmIncident = useCallback((id: string, updates: Partial<Incident>) => {
    const now = new Date().toISOString();
    setState(prev => {
      const incident = prev.incidents.find(i => i.id === id);
      if (!incident) return prev;

      const updatedIncident: Incident = {
        ...incident,
        ...updates,
        status: 'confirmed',
        confirmedBy: prev.firm.name,
        confirmedByEmail: prev.firm.ownerEmail,
        confirmedAt: now,
        updatedAt: now,
      };

      const auditEntry: AuditLogEntry = {
        id: generateId(),
        firmId: prev.firm.id,
        action: 'incident_confirmed',
        incidentId: id,
        incidentDate: updatedIncident.date,
        incidentSummary: updatedIncident.description.slice(0, 100),
        metadata: { classification: updatedIncident.classification },
        performedAt: now,
      };

      const isFirstIncident = !prev.firm.firstIncidentLoggedAt;

      return {
        ...prev,
        incidents: prev.incidents.map(i => i.id === id ? updatedIncident : i),
        auditLog: [auditEntry, ...prev.auditLog],
        firm: isFirstIncident
          ? { ...prev.firm, firstIncidentLoggedAt: now }
          : prev.firm,
      };
    });
  }, []);

  const discardIncident = useCallback((id: string, reason: string) => {
    const now = new Date().toISOString();
    setState(prev => {
      const incident = prev.incidents.find(i => i.id === id);
      if (!incident) return prev;

      const auditEntry: AuditLogEntry = {
        id: generateId(),
        firmId: prev.firm.id,
        action: 'incident_discarded',
        incidentId: id,
        incidentDate: incident.date,
        incidentSummary: incident.description.slice(0, 100),
        metadata: { reason },
        performedAt: now,
      };

      return {
        ...prev,
        incidents: prev.incidents.map(i =>
          i.id === id
            ? { ...i, status: 'discarded' as const, discardReason: reason, updatedAt: now }
            : i
        ),
        auditLog: [auditEntry, ...prev.auditLog],
      };
    });
  }, []);

  const logManualIncident = useCallback((data: Omit<Incident, 'id' | 'firmId' | 'createdAt' | 'updatedAt' | 'status' | 'retentionTier' | 'archivedAt' | 'sms48hrSent' | 'sms48hrSentAt'>) => {
    const now = new Date().toISOString();
    const newIncident: Incident = {
      ...data,
      id: generateId(),
      firmId: state.firm.id,
      status: 'confirmed',
      retentionTier: 'active',
      archivedAt: null,
      sms48hrSent: false,
      sms48hrSentAt: null,
      createdAt: now,
      updatedAt: now,
    };

    const auditEntry: AuditLogEntry = {
      id: generateId(),
      firmId: state.firm.id,
      action: 'incident_logged_manually',
      incidentId: newIncident.id,
      incidentDate: newIncident.date,
      incidentSummary: newIncident.description.slice(0, 100),
      metadata: { classification: newIncident.classification },
      performedAt: now,
    };

    setState(prev => {
      const isFirstIncident = !prev.firm.firstIncidentLoggedAt;
      return {
        ...prev,
        incidents: [newIncident, ...prev.incidents],
        auditLog: [auditEntry, ...prev.auditLog],
        firm: isFirstIncident
          ? { ...prev.firm, firstIncidentLoggedAt: now }
          : prev.firm,
      };
    });
  }, [state.firm.id]);

  const updateIncident = useCallback((id: string, updates: Partial<Incident>) => {
    setState(prev => ({
      ...prev,
      incidents: prev.incidents.map(i =>
        i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
      ),
    }));
  }, []);

  const markCustomerNotified = useCallback((id: string) => {
    const now = new Date().toISOString();
    setState(prev => ({
      ...prev,
      incidents: prev.incidents.map(i =>
        i.id === id ? { ...i, customerNotifiedAt: now, updatedAt: now } : i
      ),
      auditLog: [{
        id: generateId(),
        firmId: prev.firm.id,
        action: 'customer_notified',
        incidentId: id,
        incidentDate: prev.incidents.find(i => i.id === id)?.date ?? null,
        incidentSummary: null,
        metadata: null,
        performedAt: now,
      }, ...prev.auditLog],
    }));
  }, []);

  const acknowledgeNudge = useCallback((nudgeId: string) => {
    setState(prev => ({
      ...prev,
      nudgeLog: prev.nudgeLog.map(n =>
        n.id === nudgeId ? { ...n, acknowledgedAt: new Date().toISOString() } : n
      ),
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState(prev => ({
      ...prev,
      onboardingComplete: true,
      firm: { ...prev.firm, onboardingCompletedAt: new Date().toISOString() },
    }));
  }, []);

  const updateFirm = useCallback((updates: Partial<Firm>) => {
    setState(prev => ({
      ...prev,
      firm: { ...prev.firm, ...updates },
    }));
  }, []);

  // Helpers
  const getPendingIncidents = useCallback(() =>
    state.incidents.filter(i => i.status === 'pending_review'), [state.incidents]);

  const getConfirmedIncidents = useCallback(() =>
    state.incidents
      .filter(i => i.status === 'confirmed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [state.incidents]);

  const getActiveVendorBreaches = useCallback(() =>
    state.incidents.filter(
      i => i.status === 'confirmed' &&
        i.isVendorBreach &&
        i.customerNotificationDueAt &&
        !i.customerNotifiedAt
    ), [state.incidents]);

  const getIncidentsThisMonth = useCallback(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return state.incidents.filter(
      i => i.status === 'confirmed' && new Date(i.date) >= startOfMonth
    );
  }, [state.incidents]);

  const getIncidentsThisYear = useCallback(() => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    return state.incidents.filter(
      i => i.status === 'confirmed' && new Date(i.date) >= startOfYear
    );
  }, [state.incidents]);

  const value: MockContextValue = {
    state,
    login, signup, logout,
    confirmIncident, discardIncident, logManualIncident, updateIncident, markCustomerNotified,
    acknowledgeNudge,
    completeOnboarding,
    updateFirm,
    getPendingIncidents, getConfirmedIncidents, getActiveVendorBreaches,
    getIncidentsThisMonth, getIncidentsThisYear,
  };

  return (
    <MockContext.Provider value={value}>
      {children}
    </MockContext.Provider>
  );
}
