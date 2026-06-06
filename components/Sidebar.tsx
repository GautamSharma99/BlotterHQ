'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  PenSquare,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { useMockData } from '@/lib/mock-context';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Review', href: '/review', icon: ClipboardCheck },
  { label: 'Blotter', href: '/blotter', icon: FileText },
  { label: 'Log Incident', href: '/log', icon: PenSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { state, getPendingIncidents, logout } = useMockData();
  const pendingCount = getPendingIncidents().length;

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Shield size={18} />
            </div>
            BlotterHQ
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                {label}
                {label === 'Review' && pendingCount > 0 && (
                  <span className="sidebar-badge">{pendingCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {getInitials(state.firm.name)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{state.firm.name}</div>
              <div className="sidebar-user-status">
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: state.firm.stripeSubscriptionStatus === 'trialing' ? 'var(--color-warning)' : 'var(--color-success)',
                  display: 'inline-block',
                }} />
                {state.firm.stripeSubscriptionStatus === 'trialing' ? 'Trial' : 'Active'}
              </div>
            </div>
            <button
              className="btn-icon btn-ghost"
              onClick={() => { logout(); window.location.href = '/login'; }}
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
