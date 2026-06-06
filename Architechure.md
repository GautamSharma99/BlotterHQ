# BlotterHQ — Analysis & Implementation Plan

## Executive Summary

Your plan is architecturally sound and product-thinking is strong. The email-forward → LLM-parse → human-confirm → log loop is the right core mechanic. I've identified **12 concrete issues** ranging from schema gaps to a security contradiction in the PII-stripping design. Below is a full breakdown and a revised implementation approach.

---

## What's Strong (No Changes Needed)

- **Core mechanic** — forward → classify → confirm → log is exactly right
- **Tech stack** — Next.js + Supabase + Resend + OpenAI + Stripe is well-matched to the problem
- **Human-in-the-loop design** — LLM suggests, advisor confirms. Defensible.
- **Soft-delete on discards** — correct for audit trail requirements
- **Tiered retention** — active/archived/deleted matches the 5-year SEC requirement
- **Magic link auth** — perfect for solo advisors, one less credential
- **$29/mo pricing** — creates an easy yes vs $300+/mo platforms

---

## Issues Found & Recommended Fixes

### Issue 1: Schema Missing `sms_48hr_sent` Field

> [!WARNING]
> The Phase 5 code references `sms_48hr_sent = false` in the breach reminder query, but this column doesn't exist in the schema.

**Fix:** Add to `incidents` table:
```sql
sms_48hr_sent boolean default false,
sms_48hr_sent_at timestamptz
```

---

### Issue 2: No Audit Log Table for Hard Deletions

> [!IMPORTANT]
> The retention policy hard-deletes records after 5 years. If an SEC exam asks "did you ever have an incident on date X?" you need proof you held it for the required period and deleted it per policy — not that you destroyed evidence.

**Fix:** Add an `audit_log` table:
```sql
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references firms(id),
  action text not null,           -- 'incident_deleted', 'incident_archived', 'export_generated', etc.
  incident_id uuid,               -- nullable, reference only (incident may be deleted)
  incident_date date,             -- preserved after deletion
  incident_summary text,          -- preserved after deletion
  metadata jsonb,
  performed_at timestamptz default now()
);
```

---

### Issue 3: PII Contradiction — Snippet Still Sent to OpenAI

> [!CAUTION]
> Your Problem 3 solution says "strip PII at ingestion" and "the original email is deleted from your servers within seconds." But the classification code sends `payload.text?.slice(0, 800)` to OpenAI. That snippet likely contains customer names, account references, and breach details. You've moved the PII problem from your database to your LLM provider.

**Fix — two options (pick one):**

| Option | How it works | Tradeoff |
|--------|-------------|----------|
| **A. Classify on metadata only** | Send only `subject` + `from_domain` to the LLM. No snippet. Classification is less accurate but zero PII leaves your server. | Lower accuracy, higher privacy |
| **B. Self-hosted or Azure OpenAI with DPA** | Use Azure OpenAI (which offers a Data Processing Agreement and guarantees no training on your data) instead of public OpenAI API. Document this in your privacy policy. | Higher accuracy, requires Azure setup |

**Recommendation:** Option A for launch. Subject + sender domain is surprisingly sufficient for the three-tier classification (no_action / minor / reportable). The advisor corrects any misclassification during the confirm step anyway. Switch to Option B later if accuracy becomes a real problem.

---

### Issue 4: No Auth Middleware on Protected Routes

> [!WARNING]
> The API routes (`confirm-incident`, `log-manual`, `export-pdf`) have no authentication check shown. Anyone who guesses the endpoint could confirm incidents or export blotters.

**Fix:** Add Next.js middleware for route protection:
```
middleware.ts          — redirect unauthenticated users from /dashboard, /review, /blotter, /log
                       — verify Supabase session on all /api/* routes except /api/inbound-email and /api/webhooks/*
```

---

### Issue 5: No Rate Limiting on Inbound Email Webhook

The `/api/inbound-email` endpoint is publicly accessible (it has to be, for Resend to hit it). Without rate limiting, someone could flood it with fake emails, burning your OpenAI credits and creating noise in the blotter.

**Fix:**
- Verify the `X-Resend-Signature` header on every inbound request (Resend provides webhook signing)
- Add a per-firm rate limit (e.g., 50 emails/hour) — a solo advisor won't legitimately forward more than that
- Return 429 if exceeded

---

### Issue 6: Vendor Breach Clock Uses Wrong Start Time

The code sets `vendor_notice_received_at = new Date().toISOString()` — the moment the email hits your webhook. But the 72-hour clock under Reg S-P starts when the **advisor becomes aware** of the breach, which may differ from when the email was forwarded. If the advisor forwards a 2-day-old email, the clock is already 48 hours in.

**Fix:**
- During the **confirm step**, let the advisor set the "date you became aware of this breach" field
- Default it to the email's original date (from email headers), not the webhook receipt time
- Compute `customer_notification_due_at` from that advisor-set date

---

### Issue 7: Weekly Nudge Has No Acknowledgment Tracking

The Monday nudge email is a great audit-trail feature, but there's no record that the advisor received or acknowledged it. If the advisor claims "I never got the nudge" during an exam, you have nothing.

**Fix:** Add a `nudge_log` table:
```sql
create table nudge_log (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references firms(id),
  week_start date not null,
  week_end date not null,
  incidents_count int not null,
  sent_at timestamptz not null,
  acknowledged_at timestamptz,     -- set when advisor clicks "Confirm: nothing happened"
  unique(firm_id, week_start)
);
```
Add a one-click "Confirm: nothing happened this week" link in the nudge email that records the acknowledgment.

---

### Issue 8: Missing Onboarding State Tracking

The plan describes a 3-step onboarding flow but doesn't track whether the advisor completed it. This matters for activation metrics and for showing/hiding the onboarding UI.

**Fix:** Add to `firms` table:
```sql
onboarding_completed_at timestamptz,
first_incident_logged_at timestamptz
```

---

### Issue 9: Vercel Cron vs pg_cron — Pick One

The plan references both Vercel Cron and Supabase pg_cron without deciding. Using both creates operational confusion.

**Recommendation:** Use **Vercel Cron** for everything. It's simpler, logs are in one place, and you're already on Vercel. Define crons in `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/cron/breach-reminder", "schedule": "0 * * * *" },
    { "path": "/api/cron/weekly-nudge", "schedule": "0 14 * * 1" },
    { "path": "/api/cron/archive-incidents", "schedule": "0 3 * * *" },
    { "path": "/api/cron/delete-expired", "schedule": "0 4 * * *" }
  ]
}
```

---

### Issue 10: No Dashboard Design

The plan jumps from schema to API routes without describing the dashboard — the page the advisor sees every day. This is the most important UX surface.

**Fix — Dashboard should show:**

| Section | What it displays |
|---------|-----------------|
| **Pending Review** (top, prominent) | Count of unreviewed incidents with "Review Now" button |
| **Active Vendor Breaches** | Countdown timers with color coding (green > 48h, yellow 24–48h, red < 24h) |
| **Recent Activity** | Last 10 confirmed incidents in a clean timeline |
| **Quick Stats** | Total incidents this month / this year / all time |
| **Quick Actions** | "Log incident manually" button, "Export PDF" button |

---

### Issue 11: No Error States or Empty States in UI

Solo advisors will see empty states constantly (no incidents for weeks). The UI needs to handle this gracefully.

**Fix:** Design explicit empty states:
- Dashboard with 0 incidents: "No incidents logged yet. Forward a security email to [address] or log one manually."
- Blotter with no records: "Your blotter is clean. When you log incidents, they'll appear here."
- No pending reviews: "All caught up. No incidents waiting for your review."

---

### Issue 12: PDF Generation Strategy

The plan mentions both `@react-pdf/renderer` and `puppeteer`. Puppeteer on Vercel is problematic (binary size, cold starts, timeouts).

**Recommendation:** Use `@react-pdf/renderer` — it runs in Node.js without a browser, generates clean PDFs, and works fine on Vercel serverless. Alternatively, use a headless PDF API (like Browserless or PDFShift) if you need pixel-perfect HTML-to-PDF.

---

## Revised Schema

```sql
-- firms table (updated)
create table firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_email text not null unique,
  forwarding_address text not null unique,
  phone text,                                    -- for SMS alerts
  stripe_customer_id text,
  stripe_subscription_status text default 'trialing',
  onboarding_completed_at timestamptz,
  first_incident_logged_at timestamptz,
  created_at timestamptz default now()
);

-- incidents table (updated)
create table incidents (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references firms(id) on delete cascade,
  date date not null,
  source text not null check (source in ('email', 'manual')),
  system_affected text,
  description text not null,
  raw_email_stripped jsonb,                       -- jsonb not text, for queryability
  classification text check (classification in ('no_action', 'minor', 'reportable')),
  llm_suggested_classification text,
  llm_confidence text check (llm_confidence in ('high', 'medium', 'low')),
  customer_data_exposed boolean default false,
  is_vendor_breach boolean default false,
  vendor_name text,
  vendor_notice_received_at timestamptz,
  advisor_aware_at timestamptz,                   -- when advisor became aware (may differ from receipt)
  customer_notification_due_at timestamptz,
  customer_notified_at timestamptz,
  sms_48hr_sent boolean default false,
  sms_48hr_sent_at timestamptz,
  status text not null default 'pending_review' check (status in ('pending_review', 'confirmed', 'discarded')),
  confirmed_by text,
  confirmed_by_email text,
  confirmed_at timestamptz,
  discard_reason text,                            -- why advisor discarded (audit trail)
  retention_tier text default 'active' check (retention_tier in ('active', 'archived')),
  archived_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- audit_log (new)
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references firms(id),
  action text not null,
  incident_id uuid,
  incident_date date,
  incident_summary text,
  metadata jsonb,
  performed_at timestamptz default now()
);

-- nudge_log (new)
create table nudge_log (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references firms(id),
  week_start date not null,
  week_end date not null,
  incidents_count int not null,
  sent_at timestamptz not null,
  acknowledged_at timestamptz,
  unique(firm_id, week_start)
);

-- indexes
create index idx_incidents_firm_date on incidents(firm_id, date desc);
create index idx_incidents_firm_status on incidents(firm_id, status);
create index idx_incidents_vendor_breach on incidents(is_vendor_breach, customer_notification_due_at)
  where is_vendor_breach = true;
create index idx_audit_firm on audit_log(firm_id, performed_at desc);
create index idx_nudge_firm on nudge_log(firm_id, week_start desc);

-- RLS
alter table incidents enable row level security;
alter table audit_log enable row level security;
alter table nudge_log enable row level security;

create policy "firm_isolation" on incidents
  using (firm_id = (select id from firms where owner_email = auth.jwt()->>'email'));
create policy "firm_isolation" on audit_log
  using (firm_id = (select id from firms where owner_email = auth.jwt()->>'email'));
create policy "firm_isolation" on nudge_log
  using (firm_id = (select id from firms where owner_email = auth.jwt()->>'email'));
```

---

## Revised Project Structure

```
blotterhq/
├── app/
│   ├── layout.tsx                         # Root layout with fonts, metadata
│   ├── page.tsx                           # Landing/marketing page
│   ├── globals.css                        # Design system
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx                     # Auth layout (centered card)
│   ├── (app)/                             # Protected app shell
│   │   ├── layout.tsx                     # Sidebar + topbar layout
│   │   ├── dashboard/page.tsx
│   │   ├── review/page.tsx
│   │   ├── review/[id]/page.tsx           # Single incident review
│   │   ├── blotter/page.tsx
│   │   ├── log/page.tsx                   # Manual log form
│   │   ├── settings/page.tsx              # Forwarding address, phone, billing
│   │   └── onboarding/page.tsx
│   └── api/
│       ├── inbound-email/route.ts
│       ├── confirm-incident/route.ts
│       ├── discard-incident/route.ts      # NEW — separate from confirm
│       ├── log-manual/route.ts
│       ├── export-pdf/route.ts
│       ├── acknowledge-nudge/route.ts     # NEW
│       ├── cron/                          # NEW — all crons grouped
│       │   ├── breach-reminder/route.ts
│       │   ├── weekly-nudge/route.ts
│       │   ├── archive-incidents/route.ts
│       │   └── delete-expired/route.ts
│       └── webhooks/
│           └── stripe/route.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts                      # Browser client
│   │   ├── server.ts                      # Server client
│   │   └── admin.ts                       # Service role client (for webhooks)
│   ├── openai.ts
│   ├── classify.ts
│   ├── pdf.ts
│   ├── notifications.ts
│   ├── rate-limit.ts                      # NEW
│   └── constants.ts                       # Classification types, vendor list, etc.
├── components/
│   ├── ui/                                # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── EmptyState.tsx                 # NEW
│   │   └── CountdownTimer.tsx
│   ├── IncidentReviewCard.tsx
│   ├── BlotterTable.tsx
│   ├── VendorCountdown.tsx
│   ├── ManualLogForm.tsx
│   ├── DashboardStats.tsx                 # NEW
│   ├── RecentActivity.tsx                 # NEW
│   ├── Sidebar.tsx                        # NEW
│   └── OnboardingSteps.tsx               # NEW
├── middleware.ts                           # NEW — auth + route protection
└── vercel.json                            # Cron definitions
```

---

## Build Approach

> [!IMPORTANT]
> **Question for you:** Do you want me to build this as a **fully functional app with real Supabase/Stripe/Resend connections** (requires you to provide API keys), or as a **complete UI with mock data** that you can wire up to real services later? The mock approach lets you review the entire UX end-to-end before committing to external service setup.

### Recommended: Build with Mock Data First (MVP Demo)

Build the complete Next.js app with:
- All pages and components fully designed and interactive
- Mock data that simulates real incidents, vendor breaches, and the review flow
- Local state management (React state / localStorage) standing in for Supabase
- All UI flows working: forward simulation → review → confirm → blotter → PDF export
- Design system that looks premium and exam-ready

This lets you:
1. Review the entire product experience before wiring anything up
2. Demo it to potential users immediately
3. Get feedback before paying for any external services
4. Wire up real services one by one (Supabase first, then Resend, then Stripe)

---

## Proposed Build Order (MVP)

| Phase | Deliverable | Details |
|-------|------------|---------|
| **1** | Design system + layout shell | Globals CSS, fonts, sidebar, responsive layout |
| **2** | Landing page | Marketing page explaining the product |
| **3** | Auth pages | Login + signup with magic link UI |
| **4** | Onboarding flow | 3-step setup with forwarding address display |
| **5** | Dashboard | Stats, pending reviews, vendor breach timers, recent activity |
| **6** | Review page | Incident review cards with confirm/discard flow |
| **7** | Manual log form | Full form with all fields |
| **8** | Blotter page | Searchable, filterable table with export button |
| **9** | PDF export | Downloadable blotter with advisor attestation |
| **10** | Settings page | Forwarding address, phone, billing status |

---

## Open Questions

> [!IMPORTANT]
> **PII handling (Issue 3):** Should I implement Option A (classify on metadata only — subject + sender domain, no email body snippet) or Option B (use Azure OpenAI with DPA)? I recommend Option A for launch.

> [!IMPORTANT]
> **Build approach:** Full app with real service connections (need API keys) or complete UI with mock data first? I recommend mock data first.

> [!NOTE]
> **Design preference:** Do you have a color palette or brand direction in mind? I'm planning a dark/navy professional theme with green accent (trust + compliance feel). Let me know if you'd prefer something different.

---

## Verification Plan

### Automated
- TypeScript type checking (`tsc --noEmit`)
- Build succeeds (`npm run build`)
- All pages render without errors in dev server

### Manual
- Walk through every user flow: signup → onboarding → forward email → review → confirm → blotter → export PDF
- Test empty states on all pages
- Test responsive layout on mobile
- Verify vendor breach countdown displays correctly
- Verify PDF export includes advisor attestation on every row
