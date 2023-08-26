"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

import { separateDatesByMonth } from "@/utils/separate-dates-by-month";
import { PostsSchema } from "@/utils/zod-schema";

import { Loading } from "./Loading";

import type { PostsSchemaType } from "@/utils/zod-schema";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
  },
};

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export function CalendarList({ entries }: { entries: PostsSchemaType }) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "800px",
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["calendar-posts"],
    async ({ pageParam = 1 }: { pageParam?: number }) => {
      //* this function runs only on **CLIENT SIDE**

      const response = await fetch(`/api/feed?page=${pageParam}&pageSize=40`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const validatedData = PostsSchema.parse(await response.json());

      return validatedData;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [entries],
        pageParams: [1],
      },
      // we dont want to refetch this often
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const _entries = useMemo(() => data?.pages.flat() ?? [], [data?.pages]);

  const postsByMonth = separateDatesByMonth(_entries);

  return (
    <>
      <div className="mb-10">
        {Object.entries(postsByMonth).map(([month, posts]) => {
          return (
            <div key={month} className="mx-5 md:my-10">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="my-6 mb-10 text-3xl font-medium capitalize text-gray-900 sm:text-4xl"
              >
                {month}
              </motion.h3>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-row flex-wrap gap-4"
              >
                {posts.map((post, index) => {
                  if (index === posts.length - 1) {
                    return (
                      <div key={post.id} ref={ref}>
                        <Card post={post} />
                      </div>
                    );
                  }

                  return <Card post={post} key={post.id} />;
                })}
              </motion.div>
            </div>
          );
        })}
      </div>
      {isFetchingNextPage ? (
        <motion.div
          className="my-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loading />
        </motion.div>
      ) : null}
    </>
  );
}

const Card = ({ post }: { post: PostsSchemaType[0] }) => {
  const banner = post?.photosWithMeta[0];

  const headerDateContent = post?.header?.match(/<span>(.*?)<\/span>/)?.[0];

  return (
    <Link href={`/calendar/${post.id}`} className="relative" key={post?.id}>
      <motion.div
        variants={item}
        className={`h-[530px] max-h-[530px] w-[350px] max-w-full rounded-lg border text-xl text-gray-900 transition-all hover:bg-slate-100`}
      >
        <div className="relative h-[280px] w-full rounded-lg bg-gray-200 ">
          <Image
            src={banner?.img}
            alt={banner?.captionText ?? ""}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="rounded-lg rounded-b-none"
          />
        </div>
        <div className="mx-5 my-3">
          <div
            className={`line-clamp-4 font-semibold`}
            dangerouslySetInnerHTML={{
              __html: post?.header,
            }}
          />

          {headerDateContent ? (
            <div
              className="line-clamp-3 font-light"
              dangerouslySetInnerHTML={{
                __html: headerDateContent,
              }}
            />
          ) : null}

          <p className="absolute bottom-3 text-base">
            {dayjs(post?.date).format("DD MMMM YYYY")}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};
