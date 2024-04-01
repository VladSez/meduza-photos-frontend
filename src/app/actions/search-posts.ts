"use server";

import * as Sentry from "@sentry/nextjs";

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

  try {
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
  } catch (error) {
    console.error(error);

    Sentry.captureException(error);

    throw new Error("Failed to search posts");
  }
}
