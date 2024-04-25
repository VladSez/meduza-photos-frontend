"use server";

import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const fetchPostByDateSchema = z
  .object({
    // eslint-disable-next-line unicorn/better-regex
    // date: z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/),
    date: z.string().datetime({ offset: true }),
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
