import { NextResponse } from 'next/server';

/**
 * POST /api/confirm-incident
 * Confirms a pending incident and adds it to the blotter.
 * In production: verify auth, update Supabase, create audit log entry.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { incidentId, classification, customerDataExposed, isVendorBreach, vendorName, advisorAwareAt } = body;

    // TODO: Verify Supabase session
    // TODO: Update incident in database
    // TODO: Create audit log entry

    return NextResponse.json({ success: true, incidentId });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
