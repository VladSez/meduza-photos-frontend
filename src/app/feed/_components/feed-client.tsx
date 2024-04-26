"use client";

import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { memo } from "react";
import { Virtuoso } from "react-virtuoso";

import { useArticleInViewportContext } from "@/hooks/use-article-in-viewport-context";
import { useCalculateArticleInViewport } from "@/hooks/use-calculate-article-in-viewport";
import { useMeduzaPosts } from "@/hooks/use-meduza-posts";
import { filterOutDuplicateIds } from "@/lib/utils";

import { NextPageLoadingSpinner } from "../../../ui/next-page-loading-spinner";
import { Article } from "../../components/article";

import type { PostsSchemaType } from "@/utils/zod-schema";

export interface FeedProps {
  initialPosts: PostsSchemaType;
}

export const FeedClient = ({ initialPosts }: FeedProps) => {
  const { articleInViewport, setArticleInViewport, setArticleDateInViewport } =
    useArticleInViewportContext();

  const {
    data: feedData,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useMeduzaPosts({ initialPosts, take: 2, key: "feed" });

  const posts = filterOutDuplicateIds(
    feedData?.pages.flatMap((page) => {
      return page.posts;
    }) ?? []
  );

  return (
    <>
      <Virtuoso
        initialItemCount={posts.length}
        increaseViewportBy={1000}
        overscan={1000}
        useWindowScroll
        endReached={() => {
          if (!isFetching && hasNextPage) {
            void fetchNextPage();
          }
        }}
        data={posts}
        itemsRendered={(range) => {
          // the range has to be exactly 1, to be able to use to calculate the active section
          // (not super elegant solution unfortunately...)
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
            <div key={post.id}>
              <ArticleContainerItem post={post} />
            </div>
          );
        }}
      />
      {hasNextPage && isFetching ? (
        <motion.div
          className="mt-12 flex flex-col justify-center space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <NextPageLoadingSpinner />
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
