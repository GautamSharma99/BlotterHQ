'use client';

import Link from 'next/link';
import { useMockData } from '@/lib/mock-context';
import IncidentReviewCard from '@/components/IncidentReviewCard';
import { CheckCircle2, Inbox } from 'lucide-react';

export default function ReviewPage() {
  const { getPendingIncidents } = useMockData();
  const pending = getPendingIncidents();

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Review Incidents</h1>
        <p className="page-subtitle">
          AI has classified these incidents — review and confirm each one
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="card card-glass empty-state">
          <div className="empty-state-icon" style={{ background: 'var(--color-success-bg)' }}>
            <CheckCircle2 size={28} style={{ color: 'var(--color-success)' }} />
          </div>
          <h3>All caught up!</h3>
          <p>No incidents waiting for your review. When you forward suspicious emails, they&apos;ll appear here for classification.</p>
          <Link href="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }} className="stagger">
          <div style={{ marginBottom: 'var(--space-sm)' }}>
            <span className="badge badge-warning">
              <Inbox size={12} />
              {pending.length} pending
            </span>
          </div>
          {pending.map(incident => (
            <IncidentReviewCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
