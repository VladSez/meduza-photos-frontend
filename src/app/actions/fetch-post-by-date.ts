"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { prisma } from "@/lib/prisma";

dayjs.extend(utc);

/**
 * Fetch meduza post by date from db (server-action)
 */
export async function fetchPostByDate({ date }: { date: string }) {
  console.log({
    inputDate: date,
    // dayjs: dayjs(date).utc(true).format("YYYY/MM/DD"),

    inputFormat: dayjs(date).toISOString(),
    inputUTCFormat: dayjs(date).utc(true).toISOString(),
    now: dayjs().toISOString(),
  });

  const article = await prisma.meduzaArticles.findFirst({
    where: {
      dateString: date,
    },
    select: {
      id: true,
    },
  });

  return {
    article,
  };
}
