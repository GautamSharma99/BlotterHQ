import { NextResponse } from 'next/server';

/**
 * GET /api/cron/weekly-nudge
 * Runs every Monday at 2 PM UTC. Sends a weekly summary nudge email.
 * Vercel Cron: "0 14 * * 1"
 */
export async function GET() {
  // TODO: Query all active firms
  // TODO: For each firm, count incidents from the past week
  // TODO: Send nudge email via Resend with acknowledgment link
  // TODO: Create nudge_log entry
  return NextResponse.json({ checked: true, nudges_sent: 0 });
}
