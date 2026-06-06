import { NextResponse } from 'next/server';

/**
 * POST /api/inbound-email
 *
 * Webhook endpoint for Resend inbound email.
 * In production:
 * - Verify X-Resend-Signature header
 * - Apply per-firm rate limiting (50 emails/hour)
 * - Parse email, strip PII, classify on metadata only (Option A)
 * - Create incident with status 'pending_review'
 *
 * Currently a stub for the mock demo.
 */
export async function POST(request: Request) {
  try {
    // TODO: Verify Resend webhook signature
    // const signature = request.headers.get('X-Resend-Signature');
    // if (!verifySignature(signature, body)) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

    // TODO: Apply rate limiting
    // const firmId = lookupFirmByForwardingAddress(to);
    // if (isRateLimited(firmId)) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });

    const body = await request.json();

    // TODO: Parse email headers, classify on metadata only (subject + from_domain)
    // TODO: Create incident in Supabase with status 'pending_review'

    return NextResponse.json({
      success: true,
      message: 'Email received and queued for classification',
      incidentId: 'mock-incident-id',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
