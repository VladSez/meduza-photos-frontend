"use client";

import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { memo } from "react";
import { Virtuoso } from "react-virtuoso";

import { useArticleDateInViewportAtom } from "@/hooks/use-article-in-viewport-context";
import { useCalculateArticleInViewport } from "@/hooks/use-calculate-article-in-viewport";
import { useMeduzaPosts } from "@/hooks/use-meduza-posts";
import { filterOutDuplicateIds } from "@/lib/utils";

import { LoadingSpinner } from "../../../ui/loading-spinner";
import { Article } from "../../components/article";

import type { PostsSchemaType } from "@/utils/zod-schema";

export type FeedProps = {
  initialPosts: PostsSchemaType;
};

export const FeedClient = ({ initialPosts }: FeedProps) => {
  const [articleDateInViewport, setArticleDateInViewport] =
    useArticleDateInViewportAtom();

  const {
    data: feedData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    error,
  } = useMeduzaPosts({ initialPosts, take: 2, key: "feed" });

  const posts = filterOutDuplicateIds(
    feedData?.pages.flatMap((page) => {
      return page.posts;
    }) ?? []
  );

  return (
    <>
      <button
        onClick={() => {
          throw new Error("Sentry test client");
        }}
      >
        Sentry test
      </button>
      <Virtuoso
        initialItemCount={posts.length}
        increaseViewportBy={1000}
        overscan={1000}
        useWindowScroll
        endReached={() => {
          if (!isFetchingNextPage && hasNextPage && !error) {
            void fetchNextPage();
          }
        }}
        data={posts}
        itemsRendered={(range) => {
          // the range has to be exactly 1, to be able to use to calculate the active section
          // (pretty hacky solution unfortunately...)
          if (range?.length === 1) {
            // take last element from range
            const articleDate =
              String(dayjs(range?.[0]?.data?.date).toISOString()) ?? "";

            // update the timeline (header in mobile nav) if the article in viewport has changed
            if (articleDateInViewport !== articleDate) {
              setArticleDateInViewport(articleDate);
            }
          }
        }}
        itemContent={(_, post) => {
          return <ArticleContainerItem post={post} key={post.id} />;
        }}
      />

      {hasNextPage && !error ? (
        <motion.div
          className="mt-12 flex flex-col justify-center space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-center space-x-1.5">
            <LoadingSpinner />
          </div>
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
  // update the timeline (header in mobile nav) if the article in viewport has changed
  const { ref } = useCalculateArticleInViewport();

  return (
    <div
      id={String(post.id)}
      data-article-date={dayjs(post.date).toISOString()}
      ref={ref}
    >
      <Article article={post} />
      <hr className="my-12 h-px w-full bg-gray-200"></hr>
    </div>
  );
});
