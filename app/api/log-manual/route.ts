import { NextResponse } from 'next/server';

/**
 * POST /api/log-manual
 * Logs a manually-entered incident directly to the blotter.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Verify auth, validate fields, insert into Supabase, create audit log
    return NextResponse.json({ success: true, incidentId: 'mock-id' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
