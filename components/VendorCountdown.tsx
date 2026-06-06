'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Bell } from 'lucide-react';
import type { Incident } from '@/lib/mock-data';
import { useMockData } from '@/lib/mock-context';
import { VENDOR_DANGER_HOURS, VENDOR_WARNING_HOURS } from '@/lib/constants';

interface VendorCountdownProps {
  incident: Incident;
}

function useCountdown(dueAt: string) {
  const [remaining, setRemaining] = useState(() => {
    const diff = new Date(dueAt).getTime() - Date.now();
    return Math.max(0, diff);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(dueAt).getTime() - Date.now();
      setRemaining(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [dueAt]);

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  const isOverdue = remaining === 0;

  let status: 'safe' | 'warning' | 'danger' | 'overdue' = 'safe';
  if (isOverdue) status = 'overdue';
  else if (hours < VENDOR_DANGER_HOURS) status = 'danger';
  else if (hours < VENDOR_WARNING_HOURS) status = 'warning';

  return { hours, minutes, seconds, isOverdue, status, remaining };
}

export default function VendorCountdown({ incident }: VendorCountdownProps) {
  const { markCustomerNotified } = useMockData();
  const { hours, minutes, seconds, isOverdue, status } = useCountdown(incident.customerNotificationDueAt!);

  const statusColors = {
    safe: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    overdue: 'var(--color-danger)',
  };

  const statusBg = {
    safe: 'var(--color-success-bg)',
    warning: 'var(--color-warning-bg)',
    danger: 'var(--color-danger-bg)',
    overdue: 'var(--color-danger-bg)',
  };

  return (
    <div
      className={`card card-glass vendor-card animate-slideUp ${status === 'danger' || status === 'overdue' ? 'card-danger' : ''}`}
      style={{ borderLeftWidth: 3, borderLeftColor: statusColors[status] }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 'var(--radius-md)',
        background: statusBg[status],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <AlertTriangle size={20} style={{ color: statusColors[status] }} />
      </div>

      <div className="vendor-info">
        <div className="vendor-name">{incident.vendorName}</div>
        <div className="vendor-system">{incident.systemAffected}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Customer notification deadline
        </div>
      </div>

      <div className="vendor-countdown">
        {isOverdue ? (
          <>
            <div className="vendor-countdown-value countdown-overdue">OVERDUE</div>
            <div className="vendor-countdown-label">Immediate action required</div>
          </>
        ) : (
          <>
            <div className={`vendor-countdown-value countdown-${status}`}>
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="vendor-countdown-label">Hours remaining</div>
          </>
        )}
      </div>

      <button
        className="btn btn-sm btn-primary"
        onClick={() => markCustomerNotified(incident.id)}
        style={{ flexShrink: 0 }}
      >
        <Bell size={14} />
        Mark Notified
      </button>
    </div>
  );
}
