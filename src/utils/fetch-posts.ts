import { prisma } from "@/lib/prisma";

import { PostsSchema } from "./zod-schema";

export async function fetchPosts({ count = 5 }: { count: number }) {
  const data = await prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
    ...(count && {
      take: count,
    }),
  });

  const _data = PostsSchema.parse(data);

  return _data;
}
