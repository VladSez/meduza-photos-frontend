"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const fetchPostByDateSchema = z
  .object({
    date: z.string().min(1),
  })
  .strict();

/**
 * Fetch meduza post by date from db (server-action)
 */
export async function fetchPostByDate({ date }: { date: string }) {
  const { date: parsedDate } = fetchPostByDateSchema.parse({ date });

  await checkRateLimit({ mode: "strict" });

  const article = await prisma.meduzaArticles.findFirst({
    where: {
      dateString: parsedDate,
    },
    select: {
      id: true,
    },
  });

  if (!article?.id) {
    throw new Error(`Пост не найден: ${parsedDate}`);
  }

  redirect(`/calendar/${article?.id}`);
}
