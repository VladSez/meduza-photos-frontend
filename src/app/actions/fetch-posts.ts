"use server";

import { prisma } from "@/lib/prisma";
import { PostsSchema } from "@/utils/zod-schema";

/**
 * Fetch meduza posts from db (server-action)
 */
export async function fetchPosts({ page = 1, take = 5 }) {
  const skip = (page - 1) * take; // Calculate the number of items to skip

  try {
    const [postsResult, totalResult] = await Promise.allSettled([
      prisma.meduzaArticles.findMany({
        orderBy: {
          date: "desc",
        },
        skip,
        take,
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

    const hasMore = total - (skip + take) > 0;

    return {
      posts,
      hasMore,
      nextPage: hasMore ? page + 1 : undefined,
      hasError: false,
    };
  } catch (error) {
    console.error(error);

    return {
      posts: [],
      hasMore: false,
      nextPage: undefined,
      hasError: true,
    };
  }
}
