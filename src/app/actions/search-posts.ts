"use server";

import * as Sentry from "@sentry/nextjs";
import * as chrono from "chrono-node/ru";
import dayjs from "dayjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/redis";
import { getIpAddress } from "@/utils/get-ip";

const searchSchema = z
  .object({
    search: z.string().optional().default(""),
  })
  .strict();

export async function searchPosts({
  search = "",
}: {
  search: string | undefined;
}) {
  const { search: parsedSearch } = searchSchema.parse({ search });

  if (!parsedSearch) {
    return {
      results: [],
    };
  }

  try {
    const ip = getIpAddress();
    await checkRateLimit(ip);

    // A natural language date parser in JavaScript https://github.com/wanasit/chrono
    const chronoParseResult = chrono.parseDate(parsedSearch);

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
                    contains: parsedSearch,
                    mode: "insensitive",
                  },
                },
                {
                  subtitle: {
                    contains: parsedSearch,
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
    console.error("err:", error);

    Sentry.captureException(error);

    if (error instanceof Error && error.message === "Rate limit exceeded") {
      throw new Error("Rate limit exceeded");
    }

    throw new Error("Failed to search posts");
  }
}
