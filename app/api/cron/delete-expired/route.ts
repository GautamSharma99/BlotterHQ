import { NextResponse } from 'next/server';

/**
 * GET /api/cron/delete-expired
 * Runs daily at 4 AM UTC. Hard-deletes records older than 5 years.
 * Creates audit_log entries BEFORE deletion to preserve proof of compliance.
 * Vercel Cron: "0 4 * * *"
 */
export async function GET() {
  // TODO: Query incidents WHERE date < (now - 5 years)
  // TODO: For each, create audit_log entry with incident_date and summary (preserving proof)
  // TODO: Hard-delete the incident record
  return NextResponse.json({ checked: true, deleted: 0 });
}
