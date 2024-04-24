"use server";

import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const fetchPostByDateSchema = z
  .object({
    date: z.string().datetime().min(1),
  })
  .strict();

type fetchPostByDateType = z.infer<typeof fetchPostByDateSchema>;

/**
 * Fetch meduza post by date from db (server-action)
 */
export async function fetchPostByDate({ date }: fetchPostByDateType) {
  const { date: parsedDate } = fetchPostByDateSchema.parse({ date });

  await checkRateLimit({ mode: "strict" });

  const formattedDate = dayjs(parsedDate).format("YYYY/MM/DD");

  const article = await prisma.meduzaArticles.findFirst({
    where: {
      dateString: formattedDate,
    },
    select: {
      id: true,
    },
  });

  if (!article?.id) {
    throw new Error(`Пост не найден: ${formattedDate}`);
  }

  redirect(`/calendar/${article?.id}`);
}
