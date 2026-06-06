'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  PenSquare,
  Download,
} from 'lucide-react';
import { useMockData } from '@/lib/mock-context';
import DashboardStats from '../../../components/DashboardStats';
import RecentActivity from '../../../components/RecentActivity';
import VendorCountdown from '../../../components/VendorCountdown';

export default function DashboardPage() {
  const { getPendingIncidents, getActiveVendorBreaches } = useMockData();
  const pending = getPendingIncidents();
  const activeBreaches = getActiveVendorBreaches();

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your incident compliance overview</p>
      </div>

      {/* ─── Pending Review Alert ─────────────────────── */}
      {pending.length > 0 && (
        <div className="card card-glow animate-slideUp" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={22} style={{ color: 'var(--color-warning)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.0625rem' }}>
                  {pending.length} incident{pending.length !== 1 ? 's' : ''} pending review
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                  AI has classified these — review and confirm to add to your blotter
                </p>
              </div>
            </div>
            <Link href="/review" className="btn btn-primary">
              Review Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* ─── Stats Grid ──────────────────────────────── */}
      <DashboardStats />

      {/* ─── Vendor Breaches ─────────────────────────── */}
      {activeBreaches.length > 0 && (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <div className="section-header">
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <Clock size={18} style={{ color: 'var(--color-danger)' }} />
              Active Vendor Breaches
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }} className="stagger">
            {activeBreaches.map(breach => (
              <VendorCountdown key={breach.id} incident={breach} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Two Column: Recent + Actions ────────────── */}
      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        <div>
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <Link href="/blotter" className="btn btn-ghost btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <RecentActivity />
        </div>

        <div>
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <Link href="/log" className="card card-glass card-hover" style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
              padding: 'var(--space-lg)', textDecoration: 'none', color: 'inherit',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PenSquare size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9375rem' }}>Log Incident Manually</h4>
                <p style={{ fontSize: '0.8125rem', margin: 0 }}>Record an incident that wasn&apos;t received via email</p>
              </div>
              <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </Link>

            <Link href="/blotter" className="card card-glass card-hover" style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
              padding: 'var(--space-lg)', textDecoration: 'none', color: 'inherit',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: 'var(--color-success-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Download size={20} style={{ color: 'var(--color-success)' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9375rem' }}>Export Blotter PDF</h4>
                <p style={{ fontSize: '0.8125rem', margin: 0 }}>Download your audit-ready incident blotter</p>
              </div>
              <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
