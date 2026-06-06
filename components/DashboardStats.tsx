'use client';

import { ClipboardCheck, AlertTriangle, CalendarDays, BarChart3 } from 'lucide-react';
import { useMockData } from '@/lib/mock-context';

export default function DashboardStats() {
  const { getPendingIncidents, getConfirmedIncidents, getIncidentsThisMonth, getIncidentsThisYear } = useMockData();

  const stats = [
    {
      label: 'Pending Review',
      value: getPendingIncidents().length,
      icon: AlertTriangle,
      iconBg: 'var(--color-warning-bg)',
      iconColor: 'var(--color-warning)',
      highlight: getPendingIncidents().length > 0,
    },
    {
      label: 'This Month',
      value: getIncidentsThisMonth().length,
      icon: CalendarDays,
      iconBg: 'var(--color-primary-subtle)',
      iconColor: 'var(--color-primary)',
      highlight: false,
    },
    {
      label: 'This Year',
      value: getIncidentsThisYear().length,
      icon: BarChart3,
      iconBg: 'var(--color-info-bg)',
      iconColor: 'var(--color-info)',
      highlight: false,
    },
    {
      label: 'All Time',
      value: getConfirmedIncidents().length,
      icon: ClipboardCheck,
      iconBg: 'var(--color-success-bg)',
      iconColor: 'var(--color-success)',
      highlight: false,
    },
  ];

  return (
    <div className="stats-grid stagger">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`card card-glass stat-card animate-slideUp ${stat.highlight ? 'card-glow' : ''}`}
          >
            <div className="stat-card-icon" style={{ background: stat.iconBg }}>
              <Icon size={20} style={{ color: stat.iconColor }} />
            </div>
            <div className="stat-card-value" style={stat.highlight ? { color: 'var(--color-warning)' } : {}}>
              {stat.value}
            </div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
