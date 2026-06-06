import { NextResponse } from 'next/server';

/**
 * POST /api/acknowledge-nudge
 * Records advisor acknowledgment of the weekly nudge email.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nudgeId } = body;
    // TODO: Verify auth, update nudge_log.acknowledged_at in Supabase
    return NextResponse.json({ success: true, nudgeId });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
