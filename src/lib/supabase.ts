import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  // TODO: use server key? because we use supabase only on server-side
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);
