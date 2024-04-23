import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";

import type { NextFetchEvent, NextRequest } from "next/server";

// Define which routes you want to rate limit
export const config = {
  matcher: ["/api/:path*"], // Match all API routes
};

export default async function middleware(
  request: NextRequest,
  context: NextFetchEvent
) {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const ip = request.ip ?? "Anonymous";
  const rateLimitResponse = await rateLimit?.strict.limit(ip, { rate: 2 });

  if (rateLimitResponse) {
    context.waitUntil(rateLimitResponse.pending);

    return rateLimitResponse.success
      ? NextResponse.next()
      : new Response(`Rate limit exceeded`, {
          status: 429,
        });
  }

  return NextResponse.next();
}
