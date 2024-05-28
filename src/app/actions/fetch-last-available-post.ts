"use server";

import * as Sentry from "@sentry/nextjs";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { PostSchema } from "@/utils/zod-schema";

/**
 * Fetch the last available post from the database (server-action)
 */
// TODO: add React.cache? https://react.dev/reference/react/cache
export async function fetchLastAvailablePost() {
  try {
    await checkRateLimit({ mode: "strict" });

    const _mostRecentPost = await prisma.meduzaArticles.findFirst({
      orderBy: {
        date: "desc",
      },
      select: {
        dateString: true,
      },
    });

    const mostRecentPostDate = PostSchema.pick({ dateString: true }).parse(
      _mostRecentPost
    );

    return {
      mostRecentPostDate: mostRecentPostDate.dateString,
    };
  } catch (error) {
    console.error(error);

    Sentry.captureException(error);

    if (error instanceof Error && error.message === "Rate limit exceeded") {
      throw new Error("Rate limit exceeded");
    }

    throw new Error("Failed to fetch last available post");
  }
}
