import { createClient } from "@supabase/supabase-js";

import { env } from "@/env";

/**
 * We can't use prisma, because it's not available in the edge runtime (only node runtime)
 * We use edge runtime for og images
 * In all other cases we should use prisma
 * Issue to track: https://github.com/prisma/prisma/issues/18763
 */
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
