/**
 * Supabase browser client
 * TODO: Replace with real Supabase client initialization
 *
 * import { createBrowserClient } from '@supabase/ssr';
 *
 * export function createClient() {
 *   return createBrowserClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 *   );
 * }
 */

export function createClient() {
  console.warn('Supabase client not configured. Using mock data.');
  return null;
}
