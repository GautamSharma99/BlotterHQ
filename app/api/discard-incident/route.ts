import { NextResponse } from 'next/server';

/**
 * POST /api/discard-incident
 * Soft-deletes an incident with a required reason (audit trail).
 * In production: verify auth, update Supabase, create audit log entry.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { incidentId, reason } = body;

    if (!reason) {
      return NextResponse.json({ error: 'Discard reason is required' }, { status: 400 });
    }

    // TODO: Verify Supabase session
    // TODO: Update incident status to 'discarded', set discard_reason
    // TODO: Create audit log entry

    return NextResponse.json({ success: true, incidentId });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
