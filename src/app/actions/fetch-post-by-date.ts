"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { getIpAddress } from "@/utils/get-ip";

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

  const ip = getIpAddress();
  await checkRateLimit(ip);

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
