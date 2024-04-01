"use server";

import * as Sentry from "@sentry/nextjs";
import { unstable_cache as cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/utils/zod-schema";

async function getLastAvailablePost() {
  try {
    const _mostRecentPost = await prisma.meduzaArticles.findFirst({
      orderBy: {
        date: "desc",
      },
    });

    const mostRecentPost = PostSchema.parse(_mostRecentPost);

    return {
      mostRecentPost,
    };
  } catch (error) {
    console.error(error);

    Sentry.captureException(error);

    throw new Error("Failed to fetch last available post");
  }
}

/**
 * Fetch the last available post from the database
 */
export const fetchLastAvailablePost = cache(
  getLastAvailablePost,
  ["last-available-meduza-post"],
  {
    tags: ["last-available-meduza-post"],
    revalidate: 3600, // 1 hour
  }
);
