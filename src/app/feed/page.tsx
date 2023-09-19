import { Feed } from "@/components/feed";

// import { prisma } from "@/lib/prisma";

import { fetchPosts } from "../actions/fetch-posts";

import type { TimelineSchema } from "@/components/feed/timeline-async";
import type { Metadata } from "next";
import type { z } from "zod";

export type TimelineType = z.infer<typeof TimelineSchema>;

export const metadata: Metadata = {
  title: "Лента",
  description: "Фото хроники войны в Украине",
};

export default async function FeedList() {
  const { posts, total } = await fetchPosts({ skip: 0, take: 1 });

  return (
    <>
      <div className="my-5 grid grid-cols-12 gap-2">
        <Feed initialPosts={posts} totalPosts={total} />
      </div>
    </>
  );
}
