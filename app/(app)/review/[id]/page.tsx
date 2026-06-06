'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  ArrowLeft, CheckCircle2, XCircle, AlertTriangle,
  Mail, Calendar, Monitor, Shield, Clock,
} from 'lucide-react';
import { useMockData } from '@/lib/mock-context';
import { CLASSIFICATION_LABELS } from '@/lib/constants';
import type { Classification } from '@/lib/constants';

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, confirmIncident, discardIncident } = useMockData();

  const incident = state.incidents.find(i => i.id === params.id);

  const [classification, setClassification] = useState<Classification>(
    (incident?.llmSuggestedClassification as Classification) || 'no_action'
  );
  const [customerDataExposed, setCustomerDataExposed] = useState(incident?.customerDataExposed ?? false);
  const [isVendorBreach, setIsVendorBreach] = useState(incident?.isVendorBreach ?? false);
  const [vendorName, setVendorName] = useState(incident?.vendorName ?? '');
  const [advisorAwareDate, setAdvisorAwareDate] = useState(
    incident?.rawEmailStripped?.received_at
      ? format(new Date(incident.rawEmailStripped.received_at), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [showDiscard, setShowDiscard] = useState(false);
  const [discardReason, setDiscardReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!incident) {
    return (
      <div className="page-container">
        <div className="card card-glass empty-state">
          <h3>Incident not found</h3>
          <p>This incident may have been removed or doesn&apos;t exist.</p>
          <Link href="/review" className="btn btn-secondary">Back to Review</Link>
        </div>
      </div>
    );
  }

  if (incident.status !== 'pending_review' || confirmed) {
    return (
      <div className="page-container animate-fadeIn">
        <div className="card card-glass empty-state">
          <div className="empty-state-icon" style={{ background: 'var(--color-success-bg)' }}>
            <CheckCircle2 size={28} style={{ color: 'var(--color-success)' }} />
          </div>
          <h3>{confirmed ? 'Incident processed!' : 'Already reviewed'}</h3>
          <p>This incident has been {incident.status === 'confirmed' || confirmed ? 'confirmed and added to your blotter' : 'discarded'}.</p>
          <Link href="/review" className="btn btn-primary">Review More Incidents</Link>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    const advisorAwareAt = new Date(advisorAwareDate).toISOString();
    const updates: Record<string, unknown> = {
      classification,
      customerDataExposed,
      isVendorBreach,
      vendorName: isVendorBreach ? vendorName : null,
      advisorAwareAt,
    };

    if (isVendorBreach && customerDataExposed) {
      const dueDate = new Date(advisorAwareAt);
      dueDate.setHours(dueDate.getHours() + 72);
      updates.customerNotificationDueAt = dueDate.toISOString();
      updates.vendorNoticeReceivedAt = advisorAwareAt;
    }

    confirmIncident(incident.id, updates);
    setConfirmed(true);
    setTimeout(() => router.push('/review'), 1500);
  };

  const handleDiscard = () => {
    if (!discardReason.trim()) return;
    discardIncident(incident.id, discardReason);
    setConfirmed(true);
    setTimeout(() => router.push('/review'), 1500);
  };

  return (
    <div className="page-container animate-fadeIn">
      <Link href="/review" className="btn btn-ghost" style={{ marginBottom: 'var(--space-md)' }}>
        <ArrowLeft size={16} /> Back to Review
      </Link>

      <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {/* ─── Left: Incident Details ─────────────── */}
        <div style={{ flex: '1 1 400px', minWidth: 0 }}>
          <div className="card card-glass" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <Mail size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Received via {incident.source} · {format(new Date(incident.createdAt), 'MMM d, yyyy · h:mm a')}
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>
              {incident.systemAffected || 'Security Incident'}
            </h2>

            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              {incident.description}
            </p>

            {incident.rawEmailStripped && (
              <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email Metadata
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Subject:</span> <span style={{ color: 'var(--text-primary)' }}>{incident.rawEmailStripped.subject}</span></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>From domain:</span> <span style={{ color: 'var(--text-primary)' }}>{incident.rawEmailStripped.from_domain}</span></div>
                </div>
              </div>
            )}

            {incident.llmSuggestedClassification && (
              <div style={{
                marginTop: 'var(--space-lg)', padding: 'var(--space-md)',
                background: 'var(--color-primary-subtle)', border: '1px solid var(--color-primary-border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: '6px' }}>
                  <Shield size={14} style={{ color: 'var(--color-primary)' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-primary)' }}>AI Classification</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span className={`badge ${
                    incident.llmSuggestedClassification === 'reportable' ? 'badge-danger' :
                    incident.llmSuggestedClassification === 'minor' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {CLASSIFICATION_LABELS[incident.llmSuggestedClassification as Classification]}
                  </span>
                  {incident.llmConfidence && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {incident.llmConfidence} confidence
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right: Confirm Form ────────────────── */}
        <div style={{ flex: '0 0 380px' }}>
          <div className="card card-glass">
            <h3 style={{ fontSize: '1.0625rem', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
              Confirm & Classify
            </h3>

            <div className="auth-form">
              <div className="input-group">
                <label className="input-label" htmlFor="review-classification">
                  <Monitor size={14} style={{ display: 'inline', marginRight: 4 }} />
                  Classification
                </label>
                <select
                  id="review-classification"
                  className="input-field"
                  value={classification}
                  onChange={e => setClassification(e.target.value as Classification)}
                >
                  <option value="no_action">No Action Required</option>
                  <option value="minor">Minor Incident</option>
                  <option value="reportable">Reportable</option>
                </select>
              </div>

              <div className="toggle-wrapper" onClick={() => setCustomerDataExposed(!customerDataExposed)}>
                <div className={`toggle ${customerDataExposed ? 'active' : ''}`} />
                <span className="input-label" style={{ cursor: 'pointer' }}>Customer data exposed</span>
              </div>

              <div className="toggle-wrapper" onClick={() => setIsVendorBreach(!isVendorBreach)}>
                <div className={`toggle ${isVendorBreach ? 'active' : ''}`} />
                <span className="input-label" style={{ cursor: 'pointer' }}>Vendor breach</span>
              </div>

              {isVendorBreach && (
                <div className="animate-slideDown">
                  <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
                    <label className="input-label" htmlFor="review-vendor">Vendor name</label>
                    <input
                      id="review-vendor"
                      type="text"
                      className="input-field"
                      value={vendorName}
                      onChange={e => setVendorName(e.target.value)}
                      placeholder="e.g., Redtail CRM"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="review-aware-date">
                      <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />
                      Date you became aware
                    </label>
                    <input
                      id="review-aware-date"
                      type="datetime-local"
                      className="input-field"
                      value={advisorAwareDate}
                      onChange={e => setAdvisorAwareDate(e.target.value)}
                    />
                    <span className="input-helper">
                      <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                      72-hour notification clock starts from this date
                    </span>
                  </div>
                </div>
              )}

              <button className="btn btn-primary btn-lg" onClick={handleConfirm} style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
                <CheckCircle2 size={18} />
                Confirm Incident
              </button>

              {!showDiscard ? (
                <button className="btn btn-ghost btn-sm" onClick={() => setShowDiscard(true)} style={{ width: '100%' }}>
                  <XCircle size={14} /> Discard this incident
                </button>
              ) : (
                <div className="animate-slideDown" style={{ padding: 'var(--space-md)', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger-border)' }}>
                  <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
                    <label className="input-label" style={{ color: 'var(--color-danger)' }}>
                      <AlertTriangle size={14} style={{ display: 'inline', marginRight: 4 }} />
                      Reason for discarding (required for audit trail)
                    </label>
                    <textarea
                      className="input-field"
                      value={discardReason}
                      onChange={e => setDiscardReason(e.target.value)}
                      placeholder="e.g., Marketing email, not a security incident"
                      style={{ minHeight: 60 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <button className="btn btn-danger btn-sm" onClick={handleDiscard} disabled={!discardReason.trim()} style={{ flex: 1 }}>
                      Discard
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowDiscard(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
