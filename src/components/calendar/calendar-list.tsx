"use client";

import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useMeduzaPosts } from "@/hooks/use-meduza-posts";
import { filterOutDuplicateIds } from "@/lib/utils";
import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

import { NextPagePlaceholder } from "../ui/next-page-placeholder";
import { DatePicker } from "./calendar-date-picker";

import type { PostsSchemaType } from "@/utils/zod-schema";
import type { FeedProps } from "../feed";

export function CalendarList({ initialPosts }: FeedProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useMeduzaPosts({ initialPosts, take: 10, key: "calendar" });

  // scroll to the top of the page when the page is loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      // wrap in debounce
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  const posts = filterOutDuplicateIds(
    data?.pages.flatMap((page) => {
      return page.posts;
    }) ?? []
  );

  const postsByMonth = separateDatesByMonth(posts);

  return (
    <>
      <div className="flex justify-center">
        <DatePicker />
      </div>
      <div className="mb-10">
        {Object.entries(postsByMonth).map(([month, posts]) => {
          return (
            <div key={month} className="mx-5 md:my-10">
              <h3 className="my-6 mb-10 text-3xl font-medium capitalize text-gray-900 sm:text-4xl">
                {month}
              </h3>
              <div className="flex flex-row flex-wrap gap-4">
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
              </div>
            </div>
          );
        })}
      </div>
      {hasNextPage ? (
        <motion.div
          className="my-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <NextPagePlaceholder />
        </motion.div>
      ) : null}
    </>
  );
}

const Card = ({ post }: { post: PostsSchemaType[0] }) => {
  const banner = post?.photosWithMeta[0];

  // we extract the date from the header html
  const headerDateContent = post?.header?.match(/<span>(.*?)<\/span>/)?.[0];

  return (
    <Link href={`/calendar/${post.id}`} className="relative" key={post?.id}>
      <div
        className={`h-[530px] max-h-[530px] w-full max-w-full rounded-lg border text-xl text-gray-900 transition-all hover:bg-slate-100 md:w-[350px]`}
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
            // https://nextjs.org/docs/pages/api-reference/components/image#sizes
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={70}
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
      </div>
    </Link>
  );
};
