import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const rateLimit =
  process.env.NODE_ENV === "production"
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        analytics: true,
        // allow 20 requests from the same IP in 10 seconds
        limiter: Ratelimit.slidingWindow(20, "10s"),
      })
    : null;

export async function checkRateLimit(ip: string) {
  if (!rateLimit) {
    return;
  }

  const res = await rateLimit.limit(ip);

  if (!res.success) {
    throw new Error("Rate limit exceeded");
  }

  return res;
}
