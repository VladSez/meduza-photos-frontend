"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { prisma } from "@/lib/prisma";

dayjs.extend(utc);

/**
 * Fetch meduza post by date from db (server-action)
 */
export async function fetchPostByDate({ date }: { date: Date }) {
  const article = await prisma.meduzaArticles.findFirst({
    where: {
      dateString: dayjs(date).utc(true).format("YYYY/MM/DD"),
    },
    select: {
      id: true,
    },
  });

  return {
    article,
  };
}
