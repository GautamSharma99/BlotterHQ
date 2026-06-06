'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Copy, Check, ArrowRight, Mail, Forward, Sparkles } from 'lucide-react';
import { useMockData } from '@/lib/mock-context';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { state, completeOnboarding } = useMockData();

  const copyAddress = () => {
    navigator.clipboard.writeText(state.firm.forwardingAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finish = () => {
    completeOnboarding();
    router.push('/dashboard');
  };

  return (
    <div className="page-container animate-fadeIn" style={{ maxWidth: 600, margin: '0 auto', paddingTop: 'var(--space-3xl)' }}>
      {/* ─── Steps Indicator ─────────────────── */}
      <div className="steps">
        <div className="step">
          <div className={`step-circle ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
            {step > 1 ? <Check size={16} /> : '1'}
          </div>
          <span className={`step-label ${step === 1 ? 'active' : ''}`}>Welcome</span>
        </div>
        <div className={`step-connector ${step > 1 ? 'completed' : ''}`} />
        <div className="step">
          <div className={`step-circle ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
            {step > 2 ? <Check size={16} /> : '2'}
          </div>
          <span className={`step-label ${step === 2 ? 'active' : ''}`}>Forwarding</span>
        </div>
        <div className={`step-connector ${step > 2 ? 'completed' : ''}`} />
        <div className="step">
          <div className={`step-circle ${step === 3 ? 'active' : ''}`}>3</div>
          <span className={`step-label ${step === 3 ? 'active' : ''}`}>First Email</span>
        </div>
      </div>

      {/* ─── Step Content ────────────────────── */}
      {step === 1 && (
        <div className="card card-glass animate-slideUp" style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-lg)', color: 'var(--text-inverse)',
          }}>
            <Shield size={32} />
          </div>
          <h2 style={{ marginBottom: 'var(--space-sm)' }}>
            Welcome to BlotterHQ, {state.firm.name}!
          </h2>
          <p style={{ fontSize: '0.9375rem', marginBottom: 'var(--space-xl)' }}>
            You&apos;re about to set up your automated cybersecurity incident blotter. 
            This takes less than 2 minutes.
          </p>
          <div className="card" style={{ 
            background: 'var(--bg-base)', textAlign: 'left', 
            marginBottom: 'var(--space-xl)', padding: 'var(--space-md)' 
          }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>Here&apos;s what we&apos;ll do:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {['Set up your email forwarding address', 'Forward your first suspicious email', 'Start tracking incidents automatically'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: '0.875rem' }}>
                  <Sparkles size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setStep(2)} style={{ width: '100%' }}>
            Let&apos;s Go <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card card-glass animate-slideUp">
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            background: 'var(--color-primary-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-lg)',
          }}>
            <Mail size={28} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
            Your forwarding address
          </h2>
          <p style={{ textAlign: 'center', fontSize: '0.9375rem', marginBottom: 'var(--space-xl)' }}>
            This is your unique BlotterHQ email address. Forward suspicious emails here and we&apos;ll classify them for you.
          </p>
          <div className="copy-group" style={{ marginBottom: 'var(--space-lg)' }}>
            <span className="copy-text">{state.firm.forwardingAddress}</span>
            <button className="btn btn-sm btn-primary" onClick={copyAddress}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="card" style={{ background: 'var(--bg-base)', padding: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 'var(--space-sm)' }}>
              💡 Pro tip
            </div>
            <p style={{ fontSize: '0.8125rem', margin: 0 }}>
              Add this address to your email contacts so it&apos;s always easy to find. 
              You can also set up an auto-forward rule for specific senders.
            </p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setStep(3)} style={{ width: '100%' }}>
            I&apos;ve Copied It <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="card card-glass animate-slideUp" style={{ textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            background: 'var(--color-success-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-lg)',
          }}>
            <Forward size={28} style={{ color: 'var(--color-success)' }} />
          </div>
          <h2 style={{ marginBottom: 'var(--space-sm)' }}>
            Forward your first email
          </h2>
          <p style={{ fontSize: '0.9375rem', marginBottom: 'var(--space-xl)' }}>
            Try forwarding a suspicious or security-related email to your BlotterHQ address. 
            It&apos;ll appear in your Review queue within seconds.
          </p>
          <div className="copy-group" style={{ marginBottom: 'var(--space-xl)' }}>
            <span className="copy-text">{state.firm.forwardingAddress}</span>
            <button className="btn btn-sm btn-secondary" onClick={copyAddress}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexDirection: 'column' }}>
            <button className="btn btn-primary btn-lg" onClick={finish} style={{ width: '100%' }}>
              <Check size={18} /> I&apos;ve Forwarded an Email
            </button>
            <button className="btn btn-ghost" onClick={finish}>
              Skip for now — I&apos;ll do it later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
