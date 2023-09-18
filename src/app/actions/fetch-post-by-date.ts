"use server";

import { prisma } from "@/lib/prisma";

/**
 * Fetch meduza post by date from db (server-action)
 */
export async function fetchPostByDate({ date }: { date: string }) {
  const article = await prisma.meduzaArticles.findFirst({
    where: {
      dateString: date,
    },
    select: {
      id: true,
    },
  });

  return {
    article,
  };
}
