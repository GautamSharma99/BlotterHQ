'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useMockData } from '@/lib/mock-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useMockData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    // Simulate magic link send
    await new Promise(resolve => setTimeout(resolve, 800));
    setSent(true);

    // In mock mode: auto-login after a brief delay
    setTimeout(() => {
      login(email);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="auth-card card card-glass animate-slideUp">
      <div className="auth-header">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
          <div className="sidebar-logo-icon" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)' }}>
            <Shield size={24} />
          </div>
        </div>
        <h1>Welcome back</h1>
        <p style={{ fontSize: '0.9375rem' }}>
          Sign in to your BlotterHQ account
        </p>
      </div>

      {sent ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-md)',
          }}>
            <Mail size={24} style={{ color: 'var(--color-success)' }} />
          </div>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Check your email</h3>
          <p style={{ fontSize: '0.875rem' }}>
            We sent a magic link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
            Redirecting to dashboard...
          </p>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="you@yourfirm.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading || !email}
            style={{ width: '100%' }}
          >
            {loading ? (
              <><Loader2 size={18} className="spin" /> Sending...</>
            ) : (
              <>Send Magic Link <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      )}

      <div className="auth-link">
        Don&apos;t have an account?{' '}
        <Link href="/signup">Create one</Link>
      </div>
    </div>
  );
}
