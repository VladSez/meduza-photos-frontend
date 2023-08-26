import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { PostsSchema } from "@/utils/zod-schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _page = searchParams.get("page") ?? 1;
  const _pageSize = searchParams.get("pageSize") ?? 5;

  const page = Number(_page);
  const pageSize = Number(_pageSize);

  const skip = (page - 1) * pageSize; // Calculate the number of items to skip

  const data = await prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
    skip,
    take: pageSize,
  });

  const _data = PostsSchema.parse(data);

  return NextResponse.json(_data, { status: 200 });
}
