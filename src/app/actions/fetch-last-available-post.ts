"use server";

import * as Sentry from "@sentry/nextjs";

import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/utils/zod-schema";

/**
 * Fetch the last available post from the database (server-action)
 */
export async function fetchLastAvailablePost() {
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
