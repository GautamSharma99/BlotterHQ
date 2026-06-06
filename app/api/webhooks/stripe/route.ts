import { NextResponse } from 'next/server';

/**
 * POST /api/webhooks/stripe
 * Handles Stripe subscription webhooks.
 * Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
 */
export async function POST(request: Request) {
  try {
    // TODO: Verify Stripe webhook signature using stripe.webhooks.constructEvent()
    // TODO: Handle subscription events and update firms.stripe_subscription_status
    const body = await request.text();
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
