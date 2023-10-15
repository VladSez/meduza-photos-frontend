"use server";

import { prisma } from "@/lib/prisma";
import { PostsSchema } from "@/utils/zod-schema";

/**
 * Fetch meduza posts from db (server-action)
 */
export async function fetchPosts({ page = 1, take = 5 }) {
  const skip = (page - 1) * take; // Calculate the number of items to skip

  const _posts = await prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
    skip,
    take,
  });

  const total = await prisma.meduzaArticles.count();

  const posts = PostsSchema.parse(_posts);

  const hasMore = total - (skip + take) > 0;

  return {
    posts,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
}
