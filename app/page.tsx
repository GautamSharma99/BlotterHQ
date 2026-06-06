'use client';

import Link from 'next/link';
import { Shield, Mail, Brain, FileCheck, Check, ArrowRight, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* ─── Navigation ─────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(7, 7, 13, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 50,
      }}>
        <div className="sidebar-logo" style={{ fontSize: '1.125rem' }}>
          <div className="sidebar-logo-icon" style={{ width: 30, height: 30 }}>
            <Shield size={16} />
          </div>
          BlotterHQ
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/login" className="btn btn-ghost">Sign In</Link>
          <Link href="/signup" className="btn btn-primary">
            Start Free Trial <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-badge">
          <Zap size={14} />
          Built for SEC-Registered Investment Advisors
        </div>
        <h1>Cybersecurity incident compliance on autopilot</h1>
        <p className="subtitle">
          Forward suspicious emails. Our AI classifies them. You confirm with one click. 
          Your SEC Reg S-P blotter stays audit-ready — always.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" className="btn btn-primary btn-lg">
            Start 14-Day Free Trial <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
        <p style={{ marginTop: '16px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          No credit card required · Setup in under 2 minutes
        </p>
      </section>

      {/* ─── How It Works ────────────────────────────────── */}
      <section className="features-section">
        <h2>Three steps. Zero headaches.</h2>
        <p className="subtitle">
          From suspicious email to audit-ready blotter in under 60 seconds.
        </p>
        <div className="grid-3 stagger">
          <div className="card card-glass card-hover feature-card animate-slideUp">
            <div className="feature-icon" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
              <Mail size={28} />
            </div>
            <h3>Forward</h3>
            <p>
              Get a suspicious email? Forward it to your unique BlotterHQ address. 
              That&apos;s it — no forms, no portals, no login required.
            </p>
          </div>
          <div className="card card-glass card-hover feature-card animate-slideUp">
            <div className="feature-icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
              <Brain size={28} />
            </div>
            <h3>Classify</h3>
            <p>
              AI analyzes the email metadata and suggests a classification: 
              no action, minor incident, or reportable breach. PII never touches our servers.
            </p>
          </div>
          <div className="card card-glass card-hover feature-card animate-slideUp">
            <div className="feature-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              <FileCheck size={28} />
            </div>
            <h3>Comply</h3>
            <p>
              Review the AI&apos;s suggestion, confirm or adjust, and it&apos;s logged. 
              Export your blotter as a signed PDF anytime for SEC exams.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────────── */}
      <section style={{ padding: 'var(--space-3xl) var(--space-2xl)', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
          Everything an RIA needs
        </h2>
        <p className="subtitle" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)', fontSize: '1.0625rem' }}>
          Purpose-built for solo advisors and small firms
        </p>
        <div className="grid-2 stagger">
          {[
            { title: 'Vendor Breach Tracking', desc: 'Automatic 72-hour countdown timers with SMS alerts at 48 and 24 hours. Never miss a notification deadline.' },
            { title: 'Weekly Nudge Emails', desc: 'Every Monday, get a summary of the past week\'s activity with a one-click acknowledgment for your audit trail.' },
            { title: 'Human-in-the-Loop', desc: 'AI suggests, you decide. Every classification is confirmed by a licensed professional before it hits the blotter.' },
            { title: 'PDF Export with Attestation', desc: 'Generate exam-ready blotter PDFs with advisor attestation on every page. One click, any time.' },
            { title: '5-Year Retention', desc: 'Automatic archival and retention policy aligned with SEC requirements. Audit log preserved even after deletion.' },
            { title: 'Magic Link Auth', desc: 'No passwords to manage. Click a link in your email and you\'re in. One less credential to worry about.' },
          ].map((feature, i) => (
            <div key={i} className="card card-glass animate-slideUp" style={{ padding: 'var(--space-lg)' }}>
              <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: '1rem' }}>{feature.title}</h4>
              <p style={{ fontSize: '0.875rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────────────── */}
      <section className="pricing-section">
        <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
          Simple, transparent pricing
        </h2>
        <p className="subtitle" style={{ fontSize: '1.0625rem' }}>
          One plan. Everything included. No per-user fees.
        </p>
        <div className="card card-glass card-glow pricing-card animate-slideUp">
          <div style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 500, marginBottom: 'var(--space-xs)' }}>
            Pro Plan
          </div>
          <div className="pricing-amount">
            <span className="pricing-dollar">$29</span>
            <span className="pricing-period">/month</span>
          </div>
          <ul className="pricing-features">
            {[
              'Unlimited incident logging',
              'AI-powered email classification',
              'Vendor breach countdown tracking',
              'Weekly nudge emails with acknowledgment',
              'PDF export with advisor attestation',
              '5-year SEC-compliant retention',
              'Magic link authentication',
              'Email + SMS alerts',
            ].map((feature, i) => (
              <li key={i}>
                <Check size={18} />
                {feature}
              </li>
            ))}
          </ul>
          <Link href="/signup" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Start 14-Day Free Trial <ArrowRight size={18} />
          </Link>
          <p style={{ textAlign: 'center', marginTop: 'var(--space-md)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            No credit card required
          </p>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────── */}
      <footer className="landing-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Shield size={14} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 500 }}>BlotterHQ</span>
        </div>
        <p>© {new Date().getFullYear()} BlotterHQ. SEC Reg S-P cybersecurity incident blotter compliance.</p>
      </footer>
    </div>
  );
}
