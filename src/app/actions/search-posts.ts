"use server";

import * as Sentry from "@sentry/nextjs";
import * as chrono from "chrono-node/ru";
import dayjs from "dayjs";
import { z } from "zod";

import { checkRateLimit } from "@/lib/rate-limit";
import { supabase } from "@/lib/supabase";
import { PostSchema } from "@/utils/zod-schema";

// we overwrite the schema
const supaPostSchema = PostSchema.extend({
  date: z.string().datetime({ local: true }),
  createdAt: z.string().datetime({ local: true }).nullable(),
  updatedAt: z.string().datetime({ local: true }).nullable(),
});

export type SearchResultsPostsSupabase = z.infer<typeof supaPostSchema>;

const searchSchema = z
  .object({
    search: z.string().max(128).default(""),
  })
  .strict();

type searchSchemaType = z.infer<typeof searchSchema>;

export async function searchPosts({ search = "" }: searchSchemaType) {
  const { search: parsedSearch } = searchSchema.parse({ search });

  try {
    await checkRateLimit({ mode: "strict" });

    // A natural language date parser in JavaScript https://github.com/wanasit/chrono
    const chronoParseResult = chrono.parseDate(parsedSearch);

    // const p3 = performance.now();

    // await prisma.meduzaArticles.findMany({
    //   orderBy: {
    //     date: "desc",
    //   },
    //   where: {
    //     // If chronoParseResult is not null, we search by date, otherwise by header or subtitle
    //     ...(chronoParseResult
    //       ? {
    //           dateString: dayjs(chronoParseResult).format("YYYY/MM/DD"),
    //         }
    //       : {
    //           OR: [
    //             {
    //               header: {
    //                 contains: parsedSearch,
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               subtitle: {
    //                 contains: parsedSearch,
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         }),
    //   },
    //   take: 35,
    // });

    // const p4 = performance.now();

    // console.log("prismaTimeTook", p4 - p3);

    let parsedData: SearchResultsPostsSupabase[] | undefined;
    // let topError: PostgrestError | null = null;

    if (chronoParseResult) {
      const { data, error } = await supabase
        .from("MeduzaArticles")
        .select()
        .eq("dateString", dayjs(chronoParseResult).format("YYYY/MM/DD"));

      if (error) {
        // topError = error;
        // console.error("supa-error", error);

        throw new Error("Failed to search posts");
      } else {
        parsedData = z.array(supaPostSchema).parse(data);
      }
    } else {
      const { data, error } = await supabase
        .from("MeduzaArticles")
        .select()
        .or(
          `header.ilike.%${parsedSearch.trim()}%,subtitle.ilike.%${parsedSearch.trim()}%`
        )
        .limit(20)
        .order("id", { ascending: false }); // order by id to get the latest posts first

      // https://supabase.com/docs/guides/database/full-text-search?example-view=sql&queryGroups=language&language=js
      // const { data, error } = await supabase
      // .from('quotes')
      // .select('catchphrase')
      // .textSearch('catchphrase', `'fat' & 'cat'`, {
      //   type: 'phrase',
      //   config: 'english'
      // })

      if (error) {
        // topError = error;
        console.error("supa-error", error);

        throw new Error("Failed to search posts");
      } else {
        parsedData = z.array(supaPostSchema).parse(data);
      }
    }

    return {
      results: parsedData,
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
