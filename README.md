# BlotterHQ 🛡️

**SEC Reg S-P Cybersecurity Incident Blotter on Autopilot**

BlotterHQ is a premium, lightweight compliance tool designed specifically for solo registered investment advisors (RIAs) to help them easily log, track, and maintain audit-ready records of cybersecurity incidents as required by SEC Regulation S-P. 

---

## ✨ Features

- **Email-Forwarding Ingestion:** Advisors receive a unique forwarding address (e.g., `incoming.blotterhq.com`) to send security alert emails (e.g. phishing, vendor data breach alerts, suspicious sign-ins).
- **Metadata-Only AI Classification:** Classifies incoming incidents as *No Action*, *Minor*, or *Reportable* based strictly on the email subject line and sender domain—preventing any customer PII (Personally Identifiable Information) from leaving the server.
- **Advisor-in-the-Loop Review:** Advisors verify, correct, or discard proposed incidents. Discarding requires entering a rationale, leaving a strict audit trail.
- **Vendor Breach 72-Hour Countdowns:** Monitors vendor breach deadlines (72-hour customer notification window under Reg S-P) with active countdown timers and automated reminders.
- **Exportable Compliance Blotter:** Fully searchable and filterable database of confirmed incidents with client-side CSV export capability and stubs for attestation-backed PDF rendering.
- **Weekly Nudge Audits:** Automated cron-based weekly compliance summary nudges requiring advisor acknowledgment (e.g., "Confirm nothing happened this week") to prove ongoing monitoring.
- **Tiered Compliance Retention:** Automatons for archiving incident records after 1 year and hard-deleting records after 5 years, preserving compliance audit logs of the deletions.

---

## 🛠️ Tech Stack

- **Core & Routing:** [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- **Styling:** Vanilla CSS Custom Design System (Premium dark theme with amber/gold compliance accents, glassmorphic layouts, and responsive panels)
- **Database & Auth (Stubs):** Supabase Client & Server layers (with RLS design schemas)
- **LLM Engine (Stubs):** OpenAI metadata-only keyword/LLM classification
- **Email Gateway (Stubs):** Resend Inbound webhook gateway with signed webhook validation and per-firm rate limiting (50 emails/hour)
- **Background Tasks:** Vercel Cron scheduled endpoints (`vercel.json`)
- **PDF Generation (Stubs):** Client-side CSV parser + Server-side `@react-pdf/renderer`

---

## 📂 Project Structure

```
blotterhq/
├── app/
│   ├── layout.tsx                         # Root layout with custom font and metadata
│   ├── page.tsx                           # Landing marketing page
│   ├── globals.css                        # Global custom CSS tokens and reset styles
│   ├── (auth)/                            # Centered login/signup layout with magic link flows
│   ├── (app)/                             # Protected app layout with Sidebar navigation
│   │   ├── dashboard/                     # Action dashboard (Active breaches, stats, activities)
│   │   ├── review/                        # Pending incoming email incident review inbox
│   │   ├── review/[id]/                   # Action forms (Confirm, override classification, discard reason)
│   │   ├── blotter/                       # Filterable compliance grid & CSV exporter
│   │   ├── log/                           # Manual incident logging wizard
│   │   └── settings/                      # Config page for forwarding addresses, SMS alerts, & billing
│   └── api/                               # Rate-limited inbound webhook, stripe, and vercel cron stubs
├── components/                            # Modular components (Sidebar, DashboardStats, RecentActivity, VendorCountdown)
├── lib/                                   # Database stubs, classification logic, notifications, and local state context
├── tsconfig.json                          # TypeScript configuration (Paths-alias mapping @/* -> ./*)
└── vercel.json                            # Cron definitions for breach reminders and weekly nudges
```

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Run the Development Server
Launch the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Verify Code Quality & Build
To run type checks and compile the production build:
```bash
# Type check
npx tsc --noEmit

# Production compilation
npm run build
```

---

## 🔒 Compliance & RLS Schema Design
BlotterHQ implements Row Level Security (RLS) and database logging in line with SEC standards. To view the target PostgreSQL database schemas, audit log tables, index optimization, and RLS policies, refer to the [Architechure.md](file:///c:/Users/gauta/OneDrive/Desktop/BlotterHQ/Architechure.md) definition file.
