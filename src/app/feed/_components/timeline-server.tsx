import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { TimelineClient } from "./timeline-client";

async function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    return setTimeout(resolve, ms);
  });
}

// https://buildui.com/recipes/artificial-delay
async function minDelay<T>(promise: Promise<T>, ms: number) {
  const [p] = await Promise.all([promise, sleep(ms)]);

  return p;
}

export type TimelineType = z.infer<typeof TimelineSchema>;

const TimelineSchema = z.array(
  z
    .object({
      id: z.number(),
      date: z.date(),
    })
    .strict()
);

export const TimelineServer = async () => {
  const _timeline = prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
    take: 5000,
    select: {
      id: true,
      date: true,
    },
  });

  // artificial delay
  const delayed = await minDelay(_timeline, 1000);

  const timeline = TimelineSchema.parse(delayed);

  return <TimelineClient timeline={timeline} />;
};
