"use server";

import * as Sentry from "@sentry/nextjs";
import * as chrono from "chrono-node/ru";
import dayjs from "dayjs";

import { prisma } from "@/lib/prisma";

export async function searchPosts({
  search = "",
}: {
  search: string | undefined;
}) {
  if (!search) {
    return {
      results: [],
    };
  }

  // A natural language date parser in JavaScript https://github.com/wanasit/chrono
  const chronoParseResult = chrono.parseDate(search);

  try {
    const results = await prisma.meduzaArticles.findMany({
      orderBy: {
        date: "desc",
      },
      where: {
        // If chronoParseResult is not null, we search by date, otherwise by header or subtitle
        ...(chronoParseResult
          ? {
              dateString: dayjs(chronoParseResult).format("YYYY/MM/DD"),
            }
          : {
              OR: [
                {
                  header: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  subtitle: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }),
      },
      take: 40,
    });

    return {
      results,
    };
  } catch (error) {
    console.error(error);

    Sentry.captureException(error);

    throw new Error("Failed to search posts");
  }
}
