import { revalidatePath, revalidateTag } from "next/cache";

import { env } from "@/env";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const secret = searchParams.get("secret");

  if (secret !== env.REVALIDATE_SECRET) {
    return new Response(`Invalid credentials`, {
      status: 500,
    });
  }

  // revalidate all pages
  // https://nextjs.org/docs/app/api-reference/functions/revalidatePath#revalidating-all-data
  // https://github.com/vercel/next.js/discussions/54075
  revalidatePath("/", "layout");

  revalidateTag("fetchLastAvailablePost");

  // "visit" the pages to purge the cache
  fetch("https://meduza-photos-frontend.vercel.app/feed")
    .then((res) => {
      if (res.ok && res.status === 200) {
        console.info("/feed path visited");
      } else if (res.status !== 200) {
        console.info("/feed was not ok", res.status);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  fetch("https://meduza-photos-frontend.vercel.app/calendar")
    .then((res) => {
      if (res.ok && res.status === 200) {
        console.info("/calendar path visited");
      } else if (res.status !== 200) {
        console.info("/calendar was not ok", res.status);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return new Response("Revalidated successfully", {
    status: 200,
  });
}
