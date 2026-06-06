'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useMockData } from '@/lib/mock-context';

export default function SignupPage() {
  const [firmName, setFirmName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signup } = useMockData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName || !email) return;
    setLoading(true);

    // Simulate account creation
    await new Promise(resolve => setTimeout(resolve, 600));
    signup(firmName, email);
    router.push('/onboarding');
  };

  return (
    <div className="auth-card card card-glass animate-slideUp">
      <div className="auth-header">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
          <div className="sidebar-logo-icon" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)' }}>
            <Shield size={24} />
          </div>
        </div>
        <h1>Create your account</h1>
        <p style={{ fontSize: '0.9375rem' }}>
          Start your 14-day free trial — no credit card required
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="signup-firm">Firm name</label>
          <input
            id="signup-firm"
            type="text"
            className="input-field"
            placeholder="Meridian Wealth Advisors"
            value={firmName}
            onChange={e => setFirmName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            className="input-field"
            placeholder="you@yourfirm.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading || !firmName || !email}
          style={{ width: '100%' }}
        >
          {loading ? (
            <><Loader2 size={18} /> Creating account...</>
          ) : (
            <>Create Account <ArrowRight size={18} /></>
          )}
        </button>
      </form>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-md)', lineHeight: 1.5 }}>
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>

      <div className="auth-link">
        Already have an account?{' '}
        <Link href="/login">Sign in</Link>
      </div>
    </div>
  );
}
