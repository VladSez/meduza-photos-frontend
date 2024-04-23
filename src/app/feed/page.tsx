import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { fetchPosts } from "../actions/fetch-posts";
import { FeedClient } from "./_components/feed-client";
import { TimelineClient } from "./_components/timeline-client";

import type { Metadata } from "next";

export const revalidate = 86_400; // revalidate every 24 hours

export const metadata: Metadata = {
  title: "Лента",
  description: "Лента событий войны в Украине.",
};

const TimelineSchema = z.array(
  z
    .object({
      id: z.number(),
      date: z.date(),
    })
    .strict()
);
export type TimelineType = z.infer<typeof TimelineSchema>;

export default async function FeedList() {
  const p1 = fetchPosts({ take: 2 });

  // fetching timeline
  const p2 = prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
    take: 5000,
    select: {
      id: true,
      date: true,
    },
  });

  const [posts, timeline] = await Promise.allSettled([p1, p2]);

  if (posts.status === "rejected") {
    throw posts.reason;
  }

  if (timeline.status === "rejected") {
    throw timeline.reason;
  }

  const parsedTimeline = TimelineSchema.parse(timeline.value);

  return (
    <>
      <div className="mb-2 grid grid-cols-12 gap-2 md:my-5">
        <div className="md:col-span-2"></div>
        <div className="col-span-12 my-14 lg:col-span-8">
          <FeedClient initialPosts={posts.value.posts} />
        </div>
        <div className="relative hidden justify-center lg:col-span-2 lg:flex">
          <TimelineClient timeline={parsedTimeline} />
        </div>
      </div>
    </>
  );
}
