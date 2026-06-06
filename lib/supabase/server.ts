/**
 * Supabase server client (for Server Components and Route Handlers)
 * TODO: Replace with real Supabase server client initialization
 *
 * import { createServerClient } from '@supabase/ssr';
 * import { cookies } from 'next/headers';
 *
 * export function createClient() {
 *   const cookieStore = cookies();
 *   return createServerClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 *     { cookies: { ... } }
 *   );
 * }
 */

export function createClient() {
  console.warn('Supabase server client not configured. Using mock data.');
  return null;
}
