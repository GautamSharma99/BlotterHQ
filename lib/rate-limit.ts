/**
 * Rate limiting for the inbound email webhook.
 * Uses an in-memory map (suitable for single-instance deployments).
 *
 * In production, use Vercel KV, Upstash Redis, or similar
 * for distributed rate limiting across serverless functions.
 */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 50; // 50 emails per firm per hour

export function checkRateLimit(firmId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(firmId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(firmId, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}
