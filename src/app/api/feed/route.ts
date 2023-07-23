import { prisma } from "@/lib/prisma";
import { PostsSchema } from "@/utils/zod-schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) ?? 1;

  const pageSize = 5; // Number of results per page

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
