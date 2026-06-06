'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenSquare, CheckCircle2, Calendar, Monitor, AlertTriangle } from 'lucide-react';
import { useMockData } from '@/lib/mock-context';
import type { Classification } from '@/lib/constants';
import { format } from 'date-fns';

export default function LogIncidentPage() {
  const router = useRouter();
  const { logManualIncident } = useMockData();

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [systemAffected, setSystemAffected] = useState('');
  const [description, setDescription] = useState('');
  const [classification, setClassification] = useState<Classification>('minor');
  const [customerDataExposed, setCustomerDataExposed] = useState(false);
  const [isVendorBreach, setIsVendorBreach] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [advisorAwareDate, setAdvisorAwareDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    if (!description.trim()) newErrors.description = true;
    if (!date) newErrors.date = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const advisorAwareAt = isVendorBreach ? new Date(advisorAwareDate).toISOString() : null;
    let customerNotificationDueAt = null;
    if (isVendorBreach && customerDataExposed && advisorAwareAt) {
      const dueDate = new Date(advisorAwareAt);
      dueDate.setHours(dueDate.getHours() + 72);
      customerNotificationDueAt = dueDate.toISOString();
    }

    logManualIncident({
      date,
      source: 'manual',
      systemAffected: systemAffected || null,
      description,
      rawEmailStripped: null,
      classification,
      llmSuggestedClassification: null,
      llmConfidence: null,
      customerDataExposed,
      isVendorBreach,
      vendorName: isVendorBreach ? vendorName : null,
      vendorNoticeReceivedAt: isVendorBreach ? advisorAwareAt : null,
      advisorAwareAt,
      customerNotificationDueAt,
      customerNotifiedAt: null,
      confirmedBy: null,
      confirmedByEmail: null,
      confirmedAt: new Date().toISOString(),
      discardReason: null,
    });

    setSubmitted(true);
    setTimeout(() => router.push('/blotter'), 1500);
  };

  if (submitted) {
    return (
      <div className="page-container animate-fadeIn">
        <div className="card card-glass empty-state">
          <div className="empty-state-icon" style={{ background: 'var(--color-success-bg)' }}>
            <CheckCircle2 size={28} style={{ color: 'var(--color-success)' }} />
          </div>
          <h3>Incident logged!</h3>
          <p>The incident has been added to your blotter. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <PenSquare size={24} style={{ color: 'var(--color-primary)' }} />
          Log Incident Manually
        </h1>
        <p className="page-subtitle">Record a cybersecurity incident that wasn&apos;t received via email</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div className="card card-glass" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Monitor size={16} />
            Incident Details
          </h3>

          <div className="auth-form">
            <div className="grid-2">
              <div className="input-group">
                <label className="input-label" htmlFor="log-date">
                  <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />
                  Date of incident
                </label>
                <input
                  id="log-date"
                  type="date"
                  className={`input-field ${errors.date ? 'input-error' : ''}`}
                  value={date}
                  onChange={e => { setDate(e.target.value); setErrors(prev => ({ ...prev, date: false })); }}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="log-system">System affected</label>
                <input
                  id="log-system"
                  type="text"
                  className="input-field"
                  value={systemAffected}
                  onChange={e => setSystemAffected(e.target.value)}
                  placeholder="e.g., Email System, CRM"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="log-description">
                Description <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <textarea
                id="log-description"
                className={`input-field ${errors.description ? 'input-error' : ''}`}
                value={description}
                onChange={e => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: false })); }}
                placeholder="Describe the cybersecurity incident in detail..."
                style={{ minHeight: 120 }}
              />
              {errors.description && <span className="input-error-text">Description is required</span>}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="log-classification">Classification</label>
              <select
                id="log-classification"
                className="input-field"
                value={classification}
                onChange={e => setClassification(e.target.value as Classification)}
              >
                <option value="no_action">No Action Required</option>
                <option value="minor">Minor Incident</option>
                <option value="reportable">Reportable</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card card-glass" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <AlertTriangle size={16} />
            Severity & Breach Details
          </h3>

          <div className="auth-form">
            <div className="toggle-wrapper" onClick={() => setCustomerDataExposed(!customerDataExposed)}>
              <div className={`toggle ${customerDataExposed ? 'active' : ''}`} />
              <div>
                <span className="input-label" style={{ cursor: 'pointer', display: 'block' }}>Customer data exposed</span>
                <span className="input-helper">Check if client PII, account numbers, or financial data was potentially accessed</span>
              </div>
            </div>

            <div className="toggle-wrapper" onClick={() => setIsVendorBreach(!isVendorBreach)}>
              <div className={`toggle ${isVendorBreach ? 'active' : ''}`} />
              <div>
                <span className="input-label" style={{ cursor: 'pointer', display: 'block' }}>Vendor breach</span>
                <span className="input-helper">Check if this incident originated from a third-party vendor or service provider</span>
              </div>
            </div>

            {isVendorBreach && (
              <div className="animate-slideDown" style={{ paddingLeft: 'var(--space-xl)', borderLeft: '2px solid var(--color-primary-border)' }}>
                <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="input-label" htmlFor="log-vendor">Vendor name</label>
                  <input
                    id="log-vendor"
                    type="text"
                    className="input-field"
                    value={vendorName}
                    onChange={e => setVendorName(e.target.value)}
                    placeholder="e.g., Redtail CRM, TD Ameritrade"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="log-aware-date">Date you became aware</label>
                  <input
                    id="log-aware-date"
                    type="datetime-local"
                    className="input-field"
                    value={advisorAwareDate}
                    onChange={e => setAdvisorAwareDate(e.target.value)}
                  />
                  <span className="input-helper">72-hour customer notification clock starts from this date</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
          <CheckCircle2 size={18} />
          Log Incident to Blotter
        </button>
      </form>
    </div>
  );
}
