import type { Classification, ConfidenceLevel } from './constants';

interface ClassificationResult {
  classification: Classification;
  confidence: ConfidenceLevel;
}

/**
 * Classify an email based on metadata only (Option A — no PII sent to LLM).
 * Uses subject line and sender domain to determine classification.
 *
 * In production, this would call OpenAI/Azure OpenAI API.
 * For the mock demo, uses simple keyword matching.
 */
export function classifyEmail(subject: string, fromDomain: string): ClassificationResult {
  const subjectLower = subject.toLowerCase();
  const domainLower = fromDomain.toLowerCase();

  // Reportable keywords
  const reportableKeywords = [
    'breach', 'unauthorized access', 'data exposure', 'compromised',
    'security incident', 'data breach', 'notification required',
  ];

  // Minor keywords
  const minorKeywords = [
    'phishing', 'suspicious', 'failed login', 'blocked',
    'security alert', 'malware', 'ransomware', 'vulnerability',
  ];

  // No-action keywords
  const noActionKeywords = [
    'newsletter', 'digest', 'awareness', 'training', 'webinar',
    'marketing', 'update', 'tips', 'best practices',
  ];

  // Known marketing/sales domains
  const marketingDomains = ['sales', 'marketing', 'promo', 'offer'];

  // Check for reportable
  if (reportableKeywords.some(kw => subjectLower.includes(kw))) {
    return { classification: 'reportable', confidence: 'high' };
  }

  // Check for known marketing domains
  if (marketingDomains.some(kw => domainLower.includes(kw))) {
    return { classification: 'no_action', confidence: 'low' };
  }

  // Check for minor
  if (minorKeywords.some(kw => subjectLower.includes(kw))) {
    return { classification: 'minor', confidence: 'medium' };
  }

  // Check for no-action
  if (noActionKeywords.some(kw => subjectLower.includes(kw))) {
    return { classification: 'no_action', confidence: 'high' };
  }

  // Default: minor with low confidence
  return { classification: 'minor', confidence: 'low' };
}
