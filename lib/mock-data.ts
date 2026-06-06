import type { Classification, ConfidenceLevel, RetentionTier, Source, Status } from './constants';

// ─── Type Definitions ────────────────────────────────────────

export interface Firm {
  id: string;
  name: string;
  ownerEmail: string;
  forwardingAddress: string;
  phone: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionStatus: 'trialing' | 'active' | 'canceled' | 'past_due';
  onboardingCompletedAt: string | null;
  firstIncidentLoggedAt: string | null;
  createdAt: string;
}

export interface Incident {
  id: string;
  firmId: string;
  date: string;
  source: Source;
  systemAffected: string | null;
  description: string;
  rawEmailStripped: Record<string, string> | null;
  classification: Classification | null;
  llmSuggestedClassification: Classification | null;
  llmConfidence: ConfidenceLevel | null;
  customerDataExposed: boolean;
  isVendorBreach: boolean;
  vendorName: string | null;
  vendorNoticeReceivedAt: string | null;
  advisorAwareAt: string | null;
  customerNotificationDueAt: string | null;
  customerNotifiedAt: string | null;
  sms48hrSent: boolean;
  sms48hrSentAt: string | null;
  status: Status;
  confirmedBy: string | null;
  confirmedByEmail: string | null;
  confirmedAt: string | null;
  discardReason: string | null;
  retentionTier: RetentionTier;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  firmId: string;
  action: string;
  incidentId: string | null;
  incidentDate: string | null;
  incidentSummary: string | null;
  metadata: Record<string, unknown> | null;
  performedAt: string;
}

export interface NudgeLogEntry {
  id: string;
  firmId: string;
  weekStart: string;
  weekEnd: string;
  incidentsCount: number;
  sentAt: string;
  acknowledgedAt: string | null;
}

export interface AppState {
  firm: Firm;
  incidents: Incident[];
  auditLog: AuditLogEntry[];
  nudgeLog: NudgeLogEntry[];
  isAuthenticated: boolean;
  onboardingComplete: boolean;
}

// ─── Helper: Generate UUIDs ──────────────────────────────────

let counter = 0;
export function generateId(): string {
  counter++;
  return `${Date.now()}-${counter}-${Math.random().toString(36).substring(2, 9)}`;
}

// ─── Seed Data ───────────────────────────────────────────────

const NOW = new Date();
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000).toISOString();
const hoursAgo = (n: number) => new Date(NOW.getTime() - n * 60 * 60 * 1000).toISOString();
const hoursFromNow = (n: number) => new Date(NOW.getTime() + n * 60 * 60 * 1000).toISOString();

const FIRM_ID = 'firm-001';

export const SEED_FIRM: Firm = {
  id: FIRM_ID,
  name: 'Meridian Wealth Advisors',
  ownerEmail: 'sarah@meridianwealth.com',
  forwardingAddress: 'incidents-mwa-7x3k@blotterhq.com',
  phone: '+15551234567',
  stripeCustomerId: null,
  stripeSubscriptionStatus: 'trialing',
  onboardingCompletedAt: daysAgo(5),
  firstIncidentLoggedAt: daysAgo(4),
  createdAt: daysAgo(7),
};

export const SEED_INCIDENTS: Incident[] = [
  // Pending review — phishing email (email source)
  {
    id: 'inc-001',
    firmId: FIRM_ID,
    date: new Date().toISOString().split('T')[0],
    source: 'email',
    systemAffected: 'Email System',
    description: 'Received phishing email impersonating Schwab requesting client login credentials. Email was flagged by spam filter but one staff member clicked the link before it was blocked.',
    rawEmailStripped: {
      subject: 'Urgent: Verify Your Schwab Account Access',
      from_domain: 'schwab-secure-alerts.com',
      received_at: hoursAgo(3),
    },
    classification: null,
    llmSuggestedClassification: 'minor',
    llmConfidence: 'high',
    customerDataExposed: false,
    isVendorBreach: false,
    vendorName: null,
    vendorNoticeReceivedAt: null,
    advisorAwareAt: null,
    customerNotificationDueAt: null,
    customerNotifiedAt: null,
    sms48hrSent: false,
    sms48hrSentAt: null,
    status: 'pending_review',
    confirmedBy: null,
    confirmedByEmail: null,
    confirmedAt: null,
    discardReason: null,
    retentionTier: 'active',
    archivedAt: null,
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(3),
  },
  // Pending review — vendor breach notification
  {
    id: 'inc-002',
    firmId: FIRM_ID,
    date: new Date().toISOString().split('T')[0],
    source: 'email',
    systemAffected: 'CRM / Client Portal',
    description: 'Redtail CRM has notified us of a data breach affecting their cloud infrastructure. Client names, email addresses, and account numbers may have been exposed. Investigation is ongoing.',
    rawEmailStripped: {
      subject: 'IMPORTANT: Security Incident Notification - Redtail CRM',
      from_domain: 'redtailtechnology.com',
      received_at: hoursAgo(6),
    },
    classification: null,
    llmSuggestedClassification: 'reportable',
    llmConfidence: 'high',
    customerDataExposed: true,
    isVendorBreach: true,
    vendorName: 'Redtail CRM',
    vendorNoticeReceivedAt: hoursAgo(6),
    advisorAwareAt: null,
    customerNotificationDueAt: hoursFromNow(66),
    customerNotifiedAt: null,
    sms48hrSent: false,
    sms48hrSentAt: null,
    status: 'pending_review',
    confirmedBy: null,
    confirmedByEmail: null,
    confirmedAt: null,
    discardReason: null,
    retentionTier: 'active',
    archivedAt: null,
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(6),
  },
  // Pending review — suspicious login attempt
  {
    id: 'inc-003',
    firmId: FIRM_ID,
    date: new Date().toISOString().split('T')[0],
    source: 'email',
    systemAffected: 'Portfolio Management System',
    description: 'Multiple failed login attempts detected on our portfolio management platform from an IP address in Eastern Europe. Account was temporarily locked after 5 failed attempts.',
    rawEmailStripped: {
      subject: 'Security Alert: Multiple Failed Login Attempts',
      from_domain: 'orion-portfolio.com',
      received_at: hoursAgo(1),
    },
    classification: null,
    llmSuggestedClassification: 'minor',
    llmConfidence: 'medium',
    customerDataExposed: false,
    isVendorBreach: false,
    vendorName: null,
    vendorNoticeReceivedAt: null,
    advisorAwareAt: null,
    customerNotificationDueAt: null,
    customerNotifiedAt: null,
    sms48hrSent: false,
    sms48hrSentAt: null,
    status: 'pending_review',
    confirmedBy: null,
    confirmedByEmail: null,
    confirmedAt: null,
    discardReason: null,
    retentionTier: 'active',
    archivedAt: null,
    createdAt: hoursAgo(1),
    updatedAt: hoursAgo(1),
  },
  // Confirmed — vendor breach with active countdown
  {
    id: 'inc-004',
    firmId: FIRM_ID,
    date: daysAgo(1).split('T')[0],
    source: 'email',
    systemAffected: 'Custodian Platform',
    description: 'TD Ameritrade notified us of unauthorized access to their advisor portal. Client account numbers and balances may have been viewed by unauthorized party.',
    rawEmailStripped: {
      subject: 'Security Notice: Unauthorized Access to Advisor Portal',
      from_domain: 'tdameritrade.com',
      received_at: daysAgo(1),
    },
    classification: 'reportable',
    llmSuggestedClassification: 'reportable',
    llmConfidence: 'high',
    customerDataExposed: true,
    isVendorBreach: true,
    vendorName: 'TD Ameritrade',
    vendorNoticeReceivedAt: daysAgo(1),
    advisorAwareAt: daysAgo(1),
    customerNotificationDueAt: hoursFromNow(48),
    customerNotifiedAt: null,
    sms48hrSent: true,
    sms48hrSentAt: hoursAgo(20),
    status: 'confirmed',
    confirmedBy: 'Sarah Chen',
    confirmedByEmail: 'sarah@meridianwealth.com',
    confirmedAt: daysAgo(1),
    discardReason: null,
    retentionTier: 'active',
    archivedAt: null,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  // Confirmed — minor incident (resolved)
  {
    id: 'inc-005',
    firmId: FIRM_ID,
    date: daysAgo(3).split('T')[0],
    source: 'manual',
    systemAffected: 'Office Network',
    description: 'Staff laptop left unlocked in conference room during client meeting. No evidence of unauthorized access, but laptop contained client financial plans in open tabs.',
    rawEmailStripped: null,
    classification: 'minor',
    llmSuggestedClassification: null,
    llmConfidence: null,
    customerDataExposed: false,
    isVendorBreach: false,
    vendorName: null,
    vendorNoticeReceivedAt: null,
    advisorAwareAt: null,
    customerNotificationDueAt: null,
    customerNotifiedAt: null,
    sms48hrSent: false,
    sms48hrSentAt: null,
    status: 'confirmed',
    confirmedBy: 'Sarah Chen',
    confirmedByEmail: 'sarah@meridianwealth.com',
    confirmedAt: daysAgo(3),
    discardReason: null,
    retentionTier: 'active',
    archivedAt: null,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  // Confirmed — no action
  {
    id: 'inc-006',
    firmId: FIRM_ID,
    date: daysAgo(4).split('T')[0],
    source: 'email',
    systemAffected: 'Email System',
    description: 'Received general cybersecurity awareness newsletter from industry association discussing common threats. No incident occurred — informational only.',
    rawEmailStripped: {
      subject: 'Monthly Cybersecurity Digest - Q2 2025',
      from_domain: 'napa-net.org',
      received_at: daysAgo(4),
    },
    classification: 'no_action',
    llmSuggestedClassification: 'no_action',
    llmConfidence: 'high',
    customerDataExposed: false,
    isVendorBreach: false,
    vendorName: null,
    vendorNoticeReceivedAt: null,
    advisorAwareAt: null,
    customerNotificationDueAt: null,
    customerNotifiedAt: null,
    sms48hrSent: false,
    sms48hrSentAt: null,
    status: 'confirmed',
    confirmedBy: 'Sarah Chen',
    confirmedByEmail: 'sarah@meridianwealth.com',
    confirmedAt: daysAgo(4),
    discardReason: null,
    retentionTier: 'active',
    archivedAt: null,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  // Discarded — spam
  {
    id: 'inc-007',
    firmId: FIRM_ID,
    date: daysAgo(2).split('T')[0],
    source: 'email',
    systemAffected: null,
    description: 'Marketing email from cybersecurity vendor trying to sell monitoring services. Not an actual incident.',
    rawEmailStripped: {
      subject: 'Protect Your Firm with CyberShield Pro™',
      from_domain: 'cybershield-sales.io',
      received_at: daysAgo(2),
    },
    classification: null,
    llmSuggestedClassification: 'no_action',
    llmConfidence: 'low',
    customerDataExposed: false,
    isVendorBreach: false,
    vendorName: null,
    vendorNoticeReceivedAt: null,
    advisorAwareAt: null,
    customerNotificationDueAt: null,
    customerNotifiedAt: null,
    sms48hrSent: false,
    sms48hrSentAt: null,
    status: 'discarded',
    confirmedBy: null,
    confirmedByEmail: null,
    confirmedAt: null,
    discardReason: 'Marketing/sales email, not a security incident',
    retentionTier: 'active',
    archivedAt: null,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  // Confirmed — vendor breach with customers already notified
  {
    id: 'inc-008',
    firmId: FIRM_ID,
    date: daysAgo(14).split('T')[0],
    source: 'email',
    systemAffected: 'Financial Planning Software',
    description: 'eMoney Advisor reported a breach in their document vault feature. Client uploaded documents (tax returns, estate plans) may have been accessed. All affected clients have been notified.',
    rawEmailStripped: {
      subject: 'Data Breach Notification - eMoney Advisor Document Vault',
      from_domain: 'emoneyadvisor.com',
      received_at: daysAgo(14),
    },
    classification: 'reportable',
    llmSuggestedClassification: 'reportable',
    llmConfidence: 'high',
    customerDataExposed: true,
    isVendorBreach: true,
    vendorName: 'eMoney Advisor',
    vendorNoticeReceivedAt: daysAgo(14),
    advisorAwareAt: daysAgo(14),
    customerNotificationDueAt: daysAgo(11),
    customerNotifiedAt: daysAgo(12),
    sms48hrSent: true,
    sms48hrSentAt: daysAgo(13),
    status: 'confirmed',
    confirmedBy: 'Sarah Chen',
    confirmedByEmail: 'sarah@meridianwealth.com',
    confirmedAt: daysAgo(14),
    discardReason: null,
    retentionTier: 'active',
    archivedAt: null,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(12),
  },
];

export const SEED_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'audit-001',
    firmId: FIRM_ID,
    action: 'incident_confirmed',
    incidentId: 'inc-004',
    incidentDate: daysAgo(1).split('T')[0],
    incidentSummary: 'TD Ameritrade unauthorized access to advisor portal',
    metadata: { classification: 'reportable' },
    performedAt: daysAgo(1),
  },
  {
    id: 'audit-002',
    firmId: FIRM_ID,
    action: 'incident_confirmed',
    incidentId: 'inc-005',
    incidentDate: daysAgo(3).split('T')[0],
    incidentSummary: 'Unlocked laptop in conference room',
    metadata: { classification: 'minor' },
    performedAt: daysAgo(3),
  },
  {
    id: 'audit-003',
    firmId: FIRM_ID,
    action: 'incident_discarded',
    incidentId: 'inc-007',
    incidentDate: daysAgo(2).split('T')[0],
    incidentSummary: 'CyberShield marketing email',
    metadata: { reason: 'Marketing/sales email, not a security incident' },
    performedAt: daysAgo(2),
  },
  {
    id: 'audit-004',
    firmId: FIRM_ID,
    action: 'export_generated',
    incidentId: null,
    incidentDate: null,
    incidentSummary: null,
    metadata: { format: 'pdf', incidentCount: 5 },
    performedAt: daysAgo(1),
  },
];

export const SEED_NUDGE_LOG: NudgeLogEntry[] = [
  {
    id: 'nudge-001',
    firmId: FIRM_ID,
    weekStart: daysAgo(7).split('T')[0],
    weekEnd: daysAgo(1).split('T')[0],
    incidentsCount: 3,
    sentAt: daysAgo(1),
    acknowledgedAt: daysAgo(1),
  },
];

export const INITIAL_STATE: AppState = {
  firm: SEED_FIRM,
  incidents: SEED_INCIDENTS,
  auditLog: SEED_AUDIT_LOG,
  nudgeLog: SEED_NUDGE_LOG,
  isAuthenticated: false,
  onboardingComplete: true,
};
