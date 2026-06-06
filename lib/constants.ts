// Classification types
export const CLASSIFICATIONS = {
  NO_ACTION: 'no_action',
  MINOR: 'minor',
  REPORTABLE: 'reportable',
} as const;

export type Classification = (typeof CLASSIFICATIONS)[keyof typeof CLASSIFICATIONS];

export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  no_action: 'No Action Required',
  minor: 'Minor Incident',
  reportable: 'Reportable',
};

export const CLASSIFICATION_COLORS: Record<Classification, string> = {
  no_action: 'var(--color-success)',
  minor: 'var(--color-warning)',
  reportable: 'var(--color-danger)',
};

// Incident statuses
export const STATUSES = {
  PENDING_REVIEW: 'pending_review',
  CONFIRMED: 'confirmed',
  DISCARDED: 'discarded',
} as const;

export type Status = (typeof STATUSES)[keyof typeof STATUSES];

export const STATUS_LABELS: Record<Status, string> = {
  pending_review: 'Pending Review',
  confirmed: 'Confirmed',
  discarded: 'Discarded',
};

// Retention tiers
export const RETENTION_TIERS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export type RetentionTier = (typeof RETENTION_TIERS)[keyof typeof RETENTION_TIERS];

// Source types
export const SOURCES = {
  EMAIL: 'email',
  MANUAL: 'manual',
} as const;

export type Source = (typeof SOURCES)[keyof typeof SOURCES];

// LLM confidence levels
export const CONFIDENCE_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[keyof typeof CONFIDENCE_LEVELS];

// Navigation items
export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Review', href: '/review', icon: 'ClipboardCheck' },
  { label: 'Blotter', href: '/blotter', icon: 'FileText' },
  { label: 'Log Incident', href: '/log', icon: 'PenSquare' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
] as const;

// App-wide constants
export const APP_NAME = 'BlotterHQ';
export const APP_DESCRIPTION = 'SEC Reg S-P cybersecurity incident blotter compliance';
export const PRICE_MONTHLY = 29;
export const TRIAL_DAYS = 14;
export const SEC_RETENTION_YEARS = 5;
export const VENDOR_BREACH_HOURS = 72;
export const VENDOR_WARNING_HOURS = 48;
export const VENDOR_DANGER_HOURS = 24;
