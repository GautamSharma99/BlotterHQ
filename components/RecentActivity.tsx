'use client';

import { useMockData } from '@/lib/mock-context';
import { CLASSIFICATION_LABELS } from '@/lib/constants';
import type { Classification } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';

export default function RecentActivity() {
  const { state } = useMockData();

  // Show last 8 audit log entries
  const recentEntries = state.auditLog.slice(0, 8);

  if (recentEntries.length === 0) {
    return (
      <div className="card card-glass empty-state" style={{ padding: 'var(--space-2xl)' }}>
        <div className="empty-state-icon">
          <FileText size={28} />
        </div>
        <h3>No activity yet</h3>
        <p>When you confirm or discard incidents, they&apos;ll appear here.</p>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'incident_confirmed':
      case 'incident_logged_manually':
        return <CheckCircle2 size={14} style={{ color: 'var(--color-success)' }} />;
      case 'incident_discarded':
        return <XCircle size={14} style={{ color: 'var(--text-muted)' }} />;
      case 'export_generated':
        return <FileText size={14} style={{ color: 'var(--color-primary)' }} />;
      default:
        return <CheckCircle2 size={14} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'incident_confirmed': return 'Incident confirmed';
      case 'incident_logged_manually': return 'Incident logged manually';
      case 'incident_discarded': return 'Incident discarded';
      case 'export_generated': return 'Blotter PDF exported';
      case 'customer_notified': return 'Customers notified';
      default: return action;
    }
  };

  return (
    <div className="card card-glass" style={{ padding: 0 }}>
      <div className="timeline" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
        {recentEntries.map((entry, i) => (
          <div key={entry.id} className="timeline-item">
            <div className="timeline-marker">
              <div className={`timeline-dot ${i === 0 ? 'active' : ''}`} />
              {i < recentEntries.length - 1 && <div className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <div className="timeline-date">
                {formatDistanceToNow(new Date(entry.performedAt), { addSuffix: true })}
              </div>
              <div className="timeline-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {getActionIcon(entry.action)}
                {getActionLabel(entry.action)}
              </div>
              {entry.incidentSummary && (
                <div className="timeline-desc">
                  {entry.incidentSummary}
                  {(() => {
                    const meta = entry.metadata as Record<string, string> | null;
                    const cls = meta?.classification as Classification | undefined;
                    if (!cls) return null;
                    return (
                      <span className={`badge ${
                        cls === 'reportable' ? 'badge-danger' :
                        cls === 'minor' ? 'badge-warning' :
                        'badge-success'
                      }`} style={{ marginLeft: '8px' }}>
                        {CLASSIFICATION_LABELS[cls]}
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
