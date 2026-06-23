# BlotterHQ Real Data Execution Plan

## Summary

Convert BlotterHQ from a localStorage/mock-data demo into a production data app using Supabase Auth/Postgres, Resend inbound email, OpenAI metadata-only classification, Stripe billing, Vercel Cron, and SMS reminders. The current `MockDataProvider`, `lib/mock-data.ts`, `lib/mock-context.tsx`, stub API routes, and `null` service clients will be replaced by a server-side data access layer, real mutations, and authenticated Supabase-backed pages.

## Key Changes

- Add production dependencies: `@supabase/ssr`, `@supabase/supabase-js`, `openai`, `resend`, `stripe`, `twilio`, `zod`, and optionally `server-only`.
- Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`
  - `RESEND_API_KEY`
  - `RESEND_WEBHOOK_SECRET`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_FROM_NUMBER`
  - `CRON_SECRET`
  - `APP_URL`
- Replace `middleware.ts` with Next 16 `proxy.ts` for optimistic route protection, while enforcing authorization again in data access helpers and route handlers.
- Keep classification metadata-only: send only email subject and sender domain to OpenAI; never send email bodies or customer PII to the model.
- Move app pages away from `useMockData()`:
  - Server Components fetch initial firm/incidents/audit/nudge data.
  - Small Client Components handle interactive filters, forms, copy buttons, countdowns, and submit states.
  - Mutations use Server Actions or authenticated Route Handlers, not local context.

## Database And Data Layer

Create Supabase migrations for these tables with RLS enabled:

- `firms`
  - `id`, `name`, `owner_email`, `forwarding_address`, `phone`
  - `stripe_customer_id`, `stripe_subscription_status`
  - `onboarding_completed_at`, `first_incident_logged_at`, `created_at`, `updated_at`
- `incidents`
  - `id`, `firm_id`, `date`, `source`, `system_affected`, `description`
  - `raw_email_stripped jsonb`
  - `classification`, `llm_suggested_classification`, `llm_confidence`
  - `customer_data_exposed`, `is_vendor_breach`, `vendor_name`
  - `vendor_notice_received_at`, `advisor_aware_at`, `customer_notification_due_at`, `customer_notified_at`
  - `sms_48hr_sent`, `sms_48hr_sent_at`
  - `status`, `confirmed_by`, `confirmed_by_email`, `confirmed_at`, `discard_reason`
  - `retention_tier`, `archived_at`, `created_at`, `updated_at`
- `audit_log`
  - immutable audit events for confirm, discard, manual log, customer notified, PDF export, archive, and hard delete proof
- `nudge_log`
  - weekly nudge sends and acknowledgments
- `rate_limits`
  - keyed by firm/webhook bucket for distributed inbound-email throttling instead of in-memory maps

Add indexes for firm/date, firm/status, active vendor breach deadlines, audit timeline, forwarding address lookup, and nudge uniqueness.

Add `lib/data/` or equivalent server-only DAL:

- `getCurrentFirm()`
- `getDashboardData()`
- `getPendingIncidents()`
- `getIncidentForReview(id)`
- `getConfirmedIncidents(filters)`
- `createAuditLog()`
- `requireFirmSession()`

All DAL functions must scope queries by authenticated firm and return DTOs safe for Client Components.

## Production Flows

- Auth:
  - Use Supabase magic-link auth for login/signup.
  - On signup, create a `firms` row and generate a unique forwarding address.
  - Redirect incomplete firms to `/onboarding`.
- Inbound email:
  - Verify Resend webhook signature.
  - Parse recipient forwarding address and lookup firm.
  - Rate-limit by firm.
  - Store only stripped metadata: subject, sender domain, received timestamp, message id.
  - Classify with OpenAI using subject + sender domain only.
  - Insert `incidents.status = 'pending_review'`.
- Review:
  - Confirm updates incident classification, customer-data exposure, vendor breach fields, advisor-aware timestamp, due date, confirmer identity, and audit log.
  - Discard requires a reason and writes an audit log.
  - Vendor breach due date is `advisor_aware_at + 72 hours`.
- Manual log:
  - Validate required fields server-side.
  - Insert confirmed incident.
  - Create audit log.
  - Set `firms.first_incident_logged_at` if empty.
- Blotter/export:
  - Fetch confirmed incidents from Supabase.
  - Keep client-side filtering for UX, but source data from server.
  - Implement `/api/export-pdf` using `@react-pdf/renderer`.
  - Create an `export_generated` audit log entry.
- Settings:
  - Update phone number in Supabase.
  - Display real forwarding address and subscription status.
  - Add Stripe Checkout and customer portal actions.
  - Stripe webhook updates firm subscription status.
- Cron:
  - Verify `CRON_SECRET` on every cron route.
  - `breach-reminder`: find active vendor breaches under 48 hours and send SMS once.
  - `weekly-nudge`: send weekly email summary and create/upsert `nudge_log`.
  - `archive-incidents`: archive records older than 1 year and audit each archive.
  - `delete-expired`: write deletion audit proof, then hard-delete incidents older than 5 years.

## API / Interface Changes

- Replace mock-only API responses with validated production behavior:
  - `POST /api/inbound-email`
  - `POST /api/confirm-incident`
  - `POST /api/discard-incident`
  - `POST /api/log-manual`
  - `POST /api/export-pdf`
  - `POST /api/acknowledge-nudge`
  - `POST /api/webhooks/stripe`
  - cron `GET` routes under `/api/cron/*`
- Request bodies must be validated with `zod`.
- Authenticated routes return `401` without session and `403` if the incident/firm does not belong to the current firm.
- Public webhook routes must verify provider signatures before parsing or mutating data.
- Keep internal TypeScript domain types in sync with database column names using explicit mappers between snake_case DB rows and camelCase UI DTOs.

## Implementation Order

1. Install production dependencies and add `.env.example`.
2. Create Supabase migrations, RLS policies, indexes, and seed-free local setup notes.
3. Implement Supabase browser/server/admin clients.
4. Implement server-only DAL and DTO mappers.
5. Replace `MockDataProvider` usage page by page, starting with dashboard, review, blotter, log, settings, onboarding, then auth.
6. Implement authenticated mutations and API routes with validation and audit logging.
7. Implement inbound Resend webhook, metadata-only OpenAI classification, and rate limiting.
8. Implement Stripe checkout/webhook/customer portal.
9. Implement PDF export.
10. Implement cron jobs and SMS/email notifications.
11. Remove or quarantine mock files so production builds cannot accidentally import them.
12. Update README with real setup, env vars, Supabase migration steps, webhook setup, and cron secrets.

## Test Plan

- Static checks:
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm run build`
- Auth tests:
  - signup creates firm
  - login restores session
  - protected pages redirect unauthenticated users
- Data isolation tests:
  - one firm cannot read, confirm, discard, export, or update another firm's incidents
- Inbound email tests:
  - invalid Resend signature rejected
  - unknown forwarding address rejected
  - valid email creates pending incident with stripped metadata only
  - rate limit returns `429`
- Incident tests:
  - confirm writes incident fields and audit log
  - discard requires reason and writes audit log
  - manual log writes confirmed incident and audit log
  - vendor due date is exactly 72 hours after advisor-aware time
- Export tests:
  - PDF contains only current firm's confirmed incidents
  - export creates audit log
- Cron tests:
  - missing/invalid cron secret rejected
  - breach reminders are sent once
  - weekly nudges are idempotent per firm/week
  - archive and delete jobs create audit records
- Manual smoke test:
  - signup -> onboarding -> inbound email -> review -> confirm -> blotter -> PDF export -> settings billing flow.

## Assumptions

- Use the current intended stack: Supabase, Resend, OpenAI, Stripe, Vercel Cron, and Twilio-compatible SMS.
- Use OpenAI only with metadata-only prompts: subject and sender domain.
- Do not send raw email body content or customer PII to OpenAI.
- Use Next 16 App Router patterns from bundled docs: Server Components for data fetching, Route Handlers for APIs, and `proxy.ts` instead of new `middleware.ts` work.
- Keep the existing visual design and navigation; the task is production data wiring, not a redesign.
