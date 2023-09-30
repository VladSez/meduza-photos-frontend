"use client";

import dayjs from "dayjs";
import { motion } from "framer-motion";
import { memo } from "react";
import { Virtuoso } from "react-virtuoso";

import { useArticleInViewport } from "@/hooks/useArticleInViewport";
import { useCalculateArticleInViewport } from "@/hooks/useCalculateArticleInViewport";
import { useMeduzaPosts } from "@/hooks/useMeduzaPosts";

import { Article } from "../article";
import { LoadingNextPage } from "../ui/loading-next-page";

import type { PostsSchemaType } from "@/utils/zod-schema";
import type { FeedProps } from ".";

export const VirtualizedFeed = ({
  initialPosts,
}: Omit<FeedProps, "timeline">) => {
  const { articleInViewport, setArticleInViewport, setArticleDateInViewport } =
    useArticleInViewport();

  const {
    data: feedData,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
  } = useMeduzaPosts({ initialPosts, take: 2, key: "feed" });

  const flattenedData = feedData?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <Virtuoso
        initialItemCount={flattenedData.length}
        increaseViewportBy={1000}
        overscan={1000}
        useWindowScroll
        endReached={() => {
          if (!isFetching && hasNextPage) {
            // TODO: it's called on first page load (even if we don't scroll), consider adding (throtte or debounce?)
            void fetchNextPage();
          }
        }}
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
            <div key={post.id}>
              <ArticleContainerItem post={post} />
            </div>
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
          <LoadingNextPage />
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
