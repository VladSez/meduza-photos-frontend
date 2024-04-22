"use server";

import * as Sentry from "@sentry/nextjs";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/utils/zod-schema";

/**
 * Fetch the last available post from the database (server-action)
 */
export const fetchLastAvailablePost = unstable_cache(
  async () => {
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
  },
  ["fetchLastAvailablePost"],
  { tags: ["fetchLastAvailablePost"], revalidate: 86_400 } // revalidate every 24 hours
);
