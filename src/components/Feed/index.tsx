"use client";

import dayjs from "dayjs";
import { motion } from "framer-motion";
import { memo } from "react";
import { Virtuoso } from "react-virtuoso";

import { useArticleInViewport } from "@/hooks/useArticleInViewport";
import { useCalculateArticleInViewport } from "@/hooks/useCalculateArticleInViewport";
import { useMeduzaPosts } from "@/hooks/useMeduzaPosts";

import { Article } from "../Article";
import { Loading } from "../Loading";
import { Timeline } from "./Timeline";

import type { TimelineType } from "@/app/feed/page";
import type { PostsSchemaType } from "@/utils/zod-schema";

export interface IFeed {
  entries: PostsSchemaType;
  timeline: TimelineType;
  totalPosts: number;
}

export function Feed({ entries, timeline, totalPosts }: IFeed) {
  return (
    <>
      <div className="md:col-span-2"></div>
      <div className="col-span-12 my-14 md:col-span-8">
        <VirtualizedFeed entries={entries} totalPosts={totalPosts} />
      </div>
      <div className="relative hidden justify-center lg:col-span-2 lg:flex">
        <div className="fixed top-20">
          <Timeline timeline={timeline} />
        </div>
      </div>
    </>
  );
}

const VirtualizedFeed = ({ entries, totalPosts }: Omit<IFeed, "timeline">) => {
  const { articleInViewport, setArticleInViewport, setArticleDateInViewport } =
    useArticleInViewport();

  const {
    data: feedData,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
  } = useMeduzaPosts({ entries, totalPosts, take: 2 });

  const flattenedData = feedData?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <Virtuoso
        initialItemCount={flattenedData.length}
        increaseViewportBy={2000}
        overscan={2000}
        useWindowScroll
        endReached={() => {
          if (!isFetching && hasNextPage) {
            // TODO: it's called on first page load (even if we don't scroll), investigate why
            void fetchNextPage();
          }
        }}
        // style={{ height: "100vh" }}
        data={flattenedData}
        itemsRendered={(range) => {
          // the range has to be exactly 1, to be able to use to calculate the active section
          if (range?.length === 1) {
            // take last id from range
            const articleId = String(range?.[0]?.data?.id) ?? "";
            const articleDate =
              String(dayjs(range?.[0]?.data?.date).toISOString()) ?? "";

            if (articleInViewport !== articleId) {
              setArticleInViewport(articleId);
              setArticleDateInViewport(articleDate);
            }
          }
        }}
        itemContent={(_, post) => {
          return (
            <motion.div key={post.id}>
              <ArticleContainerItem post={post} />
            </motion.div>
          );
        }}
      />
      {hasNextPage && isFetchingNextPage ? (
        <motion.div
          className="my-10 flex flex-col justify-center space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loading />
        </motion.div>
      ) : null}
    </>
  );
};

const ArticleContainerItem = memo(function ArticleContainerItem({
  post,
}: {
  post: PostsSchemaType[0];
}) {
  const { ref } = useCalculateArticleInViewport();

  return (
    <div
      id={String(post.id)}
      data-article-date={dayjs(post.date).toISOString()}
      ref={ref}
    >
      <div>
        <Article article={post} />
      </div>
      <hr className="my-12 h-px w-full bg-gray-200"></hr>
    </div>
  );
});
