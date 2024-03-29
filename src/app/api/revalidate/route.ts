import { revalidatePath } from "next/cache";

import { env } from "@/env.mjs";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const secret = searchParams.get("secret");

  if (secret !== env.REVALIDATE_SECRET) {
    return new Response(`Invalid credentials`, {
      status: 500,
    });
  }

  // revalidate all pages
  revalidatePath("/");

  return new Response("Revalidated", {
    status: 200,
  });
}
