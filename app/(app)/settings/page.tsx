'use client';

import { useState } from 'react';
import {
  Settings, Mail, Phone, CreditCard, Copy, Check,
  Shield, AlertTriangle, ExternalLink,
} from 'lucide-react';
import { useMockData } from '@/lib/mock-context';

export default function SettingsPage() {
  const { state, updateFirm, logout } = useMockData();
  const [phone, setPhone] = useState(state.firm.phone || '');
  const [copied, setCopied] = useState(false);
  const [phoneSaved, setPhoneSaved] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(state.firm.forwardingAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savePhone = () => {
    updateFirm({ phone });
    setPhoneSaved(true);
    setTimeout(() => setPhoneSaved(false), 2000);
  };

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Settings size={24} style={{ color: 'var(--color-primary)' }} />
          Settings
        </h1>
        <p className="page-subtitle">Manage your BlotterHQ account</p>
      </div>

      <div style={{ maxWidth: 640 }}>
        {/* ─── Forwarding Address ─────────────────── */}
        <div className="settings-section">
          <div className="card card-glass">
            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <Mail size={16} style={{ color: 'var(--color-primary)' }} />
              Email Forwarding Address
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
              Forward suspicious emails to this address. We&apos;ll classify them and add them to your review queue.
            </p>
            <div className="copy-group">
              <span className="copy-text">{state.firm.forwardingAddress}</span>
              <button className="btn btn-sm btn-secondary" onClick={copyAddress}>
                {copied ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Phone Number ──────────────────────── */}
        <div className="settings-section">
          <div className="card card-glass">
            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <Phone size={16} style={{ color: 'var(--color-primary)' }} />
              SMS Alert Number
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
              Receive SMS alerts for vendor breach countdown reminders.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <input
                type="tel"
                className="input-field"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary btn-sm" onClick={savePhone}>
                {phoneSaved ? <><Check size={14} /> Saved!</> : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Billing ───────────────────────────── */}
        <div className="settings-section">
          <div className="card card-glass">
            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <CreditCard size={16} style={{ color: 'var(--color-primary)' }} />
              Billing & Subscription
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Current plan</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                  Pro Plan — $29/mo
                </div>
              </div>
              <span className={`badge ${
                state.firm.stripeSubscriptionStatus === 'trialing' ? 'badge-warning' :
                state.firm.stripeSubscriptionStatus === 'active' ? 'badge-success' : 'badge-danger'
              }`} style={{ textTransform: 'capitalize' }}>
                {state.firm.stripeSubscriptionStatus}
              </span>
            </div>
            {state.firm.stripeSubscriptionStatus === 'trialing' && (
              <button className="btn btn-primary" style={{ width: '100%' }}>
                <CreditCard size={16} />
                Upgrade to Pro <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ─── Account Info ──────────────────────── */}
        <div className="settings-section">
          <div className="card card-glass">
            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <Shield size={16} />
              Account
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Firm name</span>
                <span>{state.firm.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Email</span>
                <span>{state.firm.ownerEmail}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Member since</span>
                <span>{new Date(state.firm.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Danger Zone ───────────────────────── */}
        <div className="settings-section">
          <div className="danger-zone">
            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--color-danger)' }}>
              <AlertTriangle size={16} />
              Danger Zone
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              Once you delete your account, there is no going back. All data will be permanently removed.
            </p>
            <button className="btn btn-danger btn-sm" onClick={() => { logout(); window.location.href = '/'; }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
