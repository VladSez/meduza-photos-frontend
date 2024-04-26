import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { getIpAddress } from "@/utils/get-ip";

export const redis = Redis.fromEnv();
type Mode = "strict" | "relaxed";

export const rateLimit =
  process.env.NODE_ENV === "production"
    ? ({
        strict: new Ratelimit({
          redis: Redis.fromEnv(),
          analytics: true,
          prefix: "@ratelimit:strict",
          // allow 60 requests from the same IP in 5 mins
          limiter: Ratelimit.slidingWindow(60, "5m"),
        }),
        relaxed: new Ratelimit({
          redis: Redis.fromEnv(),
          analytics: true,
          prefix: "@ratelimit:relaxed",
          // allow 250 requests from the same IP in 5 mins
          limiter: Ratelimit.slidingWindow(250, "5m"),
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
