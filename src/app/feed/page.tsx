import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { Feed } from "@/components/Feed";

import { fetchPosts } from "@/utils/fetch-posts";

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
  title: "Feed",
  description: "Photo chronicles of war in Ukraine",
};

export default async function FeedList() {
  const entries = await fetchPosts({ count: 5 });

  // we fetch all the available dates here, we need them for the timeline
  const _data = await prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
    take: 5000,
    select: {
      id: true,
      date: true,
    },
  });

  const timeline = TimelineSchema.parse(_data);

  return (
    <>
      <div className="my-5 grid grid-cols-12 gap-2">
        <Feed entries={entries} timeline={timeline} />
      </div>
    </>
  );
}
