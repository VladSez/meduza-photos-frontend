import { z } from "zod";

import { Feed } from "@/components/feed";

import { prisma } from "@/lib/prisma";

import { fetchPosts } from "../actions/fetch-posts";

import type { Metadata } from "next";

const TimelineSchema = z.array(
  z
    .object({
      id: z.number(),
      date: z.date(),
    })
    .strict()
);

export type TimelineType = z.infer<typeof TimelineSchema>;

export const metadata: Metadata = {
  title: "Лента",
  description: "Фото хроники войны в Украине",
};

export default async function FeedList() {
  // we fetch all available dates here, we need them for the timeline
  const _timeline = await prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
    take: 5000,
    select: {
      id: true,
      date: true,
    },
  });

  const timeline = TimelineSchema.parse(_timeline);

  const { posts, total } = await fetchPosts({ skip: 0, take: 1 });

  return (
    <>
      <div className="my-5 grid grid-cols-12 gap-2">
        <Feed entries={posts} timeline={timeline} totalPosts={total} />
      </div>
    </>
  );
}
