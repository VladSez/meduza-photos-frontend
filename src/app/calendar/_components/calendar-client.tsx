"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useMeduzaPosts } from "@/hooks/use-meduza-posts";
import { filterOutDuplicateIds } from "@/lib/utils";
import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

import { NextPagePlaceholder } from "../../../ui/next-page-placeholder";
import { DatePicker } from "./calendar-date-picker";
import { CalendarDayCard } from "./calendar-day-card";

import type { FeedProps } from "@/app/feed/_components/feed-client";

export function CalendarListClient({ initialPosts }: FeedProps) {
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
        {Object.entries(postsByMonth).map(([monthAndYear, posts]) => {
          return (
            <div key={monthAndYear} className="mx-5 md:my-10">
              <h3 className="my-6 mb-10 text-3xl font-medium capitalize text-gray-900 sm:text-4xl">
                {monthAndYear}
              </h3>
              <div className="flex flex-row flex-wrap gap-4">
                {posts.map((post, index) => {
                  // if it's the last post, add a ref to the last post
                  if (index === posts.length - 1) {
                    return (
                      <div key={post.id} ref={ref}>
                        <CalendarDayCard post={post} index={index} />
                      </div>
                    );
                  }

                  return (
                    <CalendarDayCard post={post} key={post.id} index={index} />
                  );
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
