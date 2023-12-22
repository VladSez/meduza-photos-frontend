"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

/**
 * Fetch meduza post by date from db (server-action)
 */
export async function fetchPostByDate({ date }: { date: string }) {
  const article = await prisma.meduzaArticles.findFirst({
    where: {
      dateString: date,
    },
    select: {
      id: true,
    },
  });

  if (!article?.id) {
    throw new Error(`Пост не найден: ${date}`);
  }

  redirect(`/calendar/${article?.id}`);
}
