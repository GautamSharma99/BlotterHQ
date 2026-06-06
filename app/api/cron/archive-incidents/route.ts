import { NextResponse } from 'next/server';

/**
 * GET /api/cron/archive-incidents
 * Runs daily at 3 AM UTC. Archives incidents older than 1 year.
 * Vercel Cron: "0 3 * * *"
 */
export async function GET() {
  // TODO: Query incidents WHERE retention_tier = 'active' AND date < (now - 1 year)
  // TODO: Update retention_tier to 'archived', set archived_at
  // TODO: Create audit_log entries
  return NextResponse.json({ checked: true, archived: 0 });
}
