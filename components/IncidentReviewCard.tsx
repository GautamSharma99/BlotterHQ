'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, Mail, Shield } from 'lucide-react';
import type { Incident } from '@/lib/mock-data';
import { CLASSIFICATION_LABELS } from '@/lib/constants';
import type { Classification } from '@/lib/constants';

interface Props {
  incident: Incident;
}

export default function IncidentReviewCard({ incident }: Props) {
  const classification = incident.llmSuggestedClassification;
  const classificationClass = classification ? `classification-${classification}` : '';

  const confidenceBadge = {
    high: 'badge-success',
    medium: 'badge-warning',
    low: 'badge-danger',
  };

  return (
    <Link
      href={`/review/${incident.id}`}
      className={`card card-glass card-hover review-card ${classificationClass} animate-slideUp`}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 'var(--space-lg)',
        padding: 'var(--space-lg)', textDecoration: 'none', color: 'inherit',
        paddingLeft: 'calc(var(--space-lg) + 4px)',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--radius-md)',
        background: incident.source === 'email' ? 'var(--color-primary-subtle)' : 'var(--color-info-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {incident.source === 'email' ? (
          <Mail size={18} style={{ color: 'var(--color-primary)' }} />
        ) : (
          <Shield size={18} style={{ color: 'var(--color-info)' }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {format(new Date(incident.createdAt), 'MMM d, yyyy · h:mm a')}
          </span>
          {incident.isVendorBreach && (
            <span className="badge badge-danger">Vendor Breach</span>
          )}
          {incident.customerDataExposed && (
            <span className="badge badge-warning">Customer Data</span>
          )}
        </div>

        <h4 style={{ fontSize: '0.9375rem', marginBottom: '6px', lineHeight: 1.4 }}>
          {incident.systemAffected || 'Unknown System'}
        </h4>

        <p style={{
          fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {incident.description}
        </p>

        {classification && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI suggests:</span>
            <span className={`badge ${
              classification === 'reportable' ? 'badge-danger' :
              classification === 'minor' ? 'badge-warning' : 'badge-success'
            }`}>
              {CLASSIFICATION_LABELS[classification as Classification]}
            </span>
            {incident.llmConfidence && (
              <span className={`badge ${confidenceBadge[incident.llmConfidence]}`} style={{ fontSize: '0.6875rem' }}>
                {incident.llmConfidence} confidence
              </span>
            )}
          </div>
        )}
      </div>

      <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
    </Link>
  );
}
