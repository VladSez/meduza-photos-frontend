"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useMeduzaPosts } from "@/hooks/use-meduza-posts";
import { filterOutDuplicateIds } from "@/lib/utils";
import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

import { LoadingSpinner } from "../../../ui/loading-spinner";
import { DatePicker } from "./calendar-date-picker";
import { CalendarDayCard } from "./calendar-day-card";

import type { FeedProps } from "@/app/feed/_components/feed-client";

export function CalendarListClient({ initialPosts }: FeedProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, error } =
    useMeduzaPosts({ initialPosts, take: 10, key: "calendar" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !error) {
      // TODO: wrap in debounce?
      void fetchNextPage();
    }
  }, [error, fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  const posts = filterOutDuplicateIds(
    data?.pages.flatMap((page) => {
      return page.posts;
    }) ?? []
  );

  const postsByMonth = separateDatesByMonth(posts);

  return (
    <div className="">
      <div className="flex justify-center">
        <DatePicker />
      </div>
      <div className="pb-10">
        {Object.entries(postsByMonth).map(([monthAndYear, posts]) => {
          return (
            <div key={monthAndYear} className="mx-5 md:my-10">
              <h3 className="my-6 mb-10 text-3xl font-medium capitalize text-gray-900 sm:text-4xl">
                {monthAndYear}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {posts.map((post, index) => {
                  const isLastPost = index === posts.length - 1;

                  // add a ref to the last post, we use to fetch more items
                  if (isLastPost) {
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
      {hasNextPage && !error ? (
        <motion.div
          className="flex justify-center pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-center space-x-1.5">
            <LoadingSpinner />
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
