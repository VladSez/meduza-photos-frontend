"use server";

import * as Sentry from "@sentry/nextjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { PostsSchema } from "@/utils/zod-schema";

import type { PostsSchemaType } from "@/utils/zod-schema";

const fetchPostsSchema = z
  .object({
    page: z.number().int().positive().default(1),
    take: z.number().int().positive().default(5),
  })
  .strict();

/**
 * Fetch meduza posts from db (server-action)
 */
export async function fetchPosts({
  page = 1,
  take = 5,
  isServerAction = false,
}: { page?: number; take?: number; isServerAction?: boolean } = {}) {
  const parsed = fetchPostsSchema.parse({ page, take });

  const { page: validatedPage, take: validatedTake } = parsed;

  try {
    // this is used for the infinite scroll, so we want to relax a bit the rate limit
    if (isServerAction) {
      await checkRateLimit({ mode: "relaxed" });
    }

    const skip = (validatedPage - 1) * validatedTake; // Calculate the number of items to skip

    const [postsResult, totalResult] = await Promise.allSettled([
      prisma.meduzaArticles.findMany({
        orderBy: {
          date: "desc",
        },
        skip,
        take: validatedTake,
      }),
      prisma.meduzaArticles.count(),
    ]);

    if (postsResult.status === "rejected") {
      throw postsResult.reason;
    }

    if (totalResult.status === "rejected") {
      throw totalResult.reason;
    }

    const posts = PostsSchema.parse(postsResult.value);
    const total = totalResult.value;

    const hasMore = total - (skip + validatedTake) > 0;

    return {
      posts,
      hasMore,
      nextPage: hasMore ? validatedPage + 1 : undefined,
    } satisfies {
      posts: PostsSchemaType;
      hasMore: boolean;
      nextPage: number | undefined;
    };
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);

    if (error instanceof Error && error.message === "Rate limit exceeded") {
      throw new Error("Rate limit exceeded");
    }

    throw new Error("Failed to fetch posts");
  }
}
