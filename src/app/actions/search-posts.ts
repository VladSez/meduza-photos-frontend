"use server";

import { prisma } from "@/lib/prisma";

export async function searchPosts({
  search = "",
}: {
  search: string | undefined;
}) {
  if (!search) {
    return {
      results: [],
    };
  }

  const results = await prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
    where: {
      OR: [
        {
          header: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          subtitle: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    take: 40,
  });

  return {
    results,
  };
}
