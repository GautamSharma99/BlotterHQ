/**
 * Email notification utilities
 * TODO: Replace with real Resend integration
 *
 * import { Resend } from 'resend';
 * const resend = new Resend(process.env.RESEND_API_KEY);
 *
 * Available notification types:
 * - Magic link login email
 * - Weekly nudge summary (with acknowledgment link)
 * - Vendor breach SMS reminder (via Twilio)
 * - Incident confirmation receipt
 */

export async function sendMagicLink(email: string, token: string): Promise<boolean> {
  console.log(`[MOCK] Magic link sent to ${email}: /auth/verify?token=${token}`);
  return true;
}

export async function sendWeeklyNudge(
  email: string,
  firmName: string,
  incidentCount: number,
  weekStart: string,
  weekEnd: string,
  acknowledgeUrl: string,
): Promise<boolean> {
  console.log(`[MOCK] Weekly nudge sent to ${email}: ${incidentCount} incidents, acknowledge at ${acknowledgeUrl}`);
  return true;
}

export async function sendBreachReminder(
  phone: string,
  vendorName: string,
  hoursRemaining: number,
): Promise<boolean> {
  console.log(`[MOCK] SMS breach reminder to ${phone}: ${vendorName} - ${hoursRemaining}h remaining`);
  return true;
}
