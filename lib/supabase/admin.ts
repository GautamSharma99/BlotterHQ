/**
 * Supabase admin client (service role — for webhooks and cron jobs)
 * WARNING: This bypasses RLS. Only use in server-side code, never expose to the browser.
 *
 * TODO: Replace with real Supabase admin client
 *
 * import { createClient } from '@supabase/supabase-js';
 *
 * export const supabaseAdmin = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *   process.env.SUPABASE_SERVICE_ROLE_KEY!,
 * );
 */

export const supabaseAdmin = null;
