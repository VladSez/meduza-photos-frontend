import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { getIpAddress } from "@/utils/get-ip";

type Mode = "strict" | "relaxed";

export const rateLimit =
  process.env.NODE_ENV === "production"
    ? ({
        strict: new Ratelimit({
          redis: Redis.fromEnv(),
          analytics: true,
          prefix: "@ratelimit:strict",
          // allow 30 requests from the same IP in 60 seconds
          limiter: Ratelimit.slidingWindow(30, "60s"),
        }),
        relaxed: new Ratelimit({
          redis: Redis.fromEnv(),
          analytics: true,
          prefix: "@ratelimit:relaxed",
          // allow 60 requests from the same IP in 60 seconds
          limiter: Ratelimit.slidingWindow(60, "60s"),
        }),
      } as const satisfies { [key in Mode]: Ratelimit })
    : null;

export async function checkRateLimit({ mode }: { mode: Mode }) {
  if (!rateLimit || !rateLimit?.[mode]) {
    return;
  }

  const ipAddress = getIpAddress();
  const res = await rateLimit?.[mode].limit(ipAddress);

  if (!res.success) {
    throw new Error("Rate limit exceeded");
  }

  return res;
}
