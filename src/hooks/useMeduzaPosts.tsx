"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchPosts } from "@/app/actions/fetch-posts";

import type { FeedProps } from "@/components/feed";

interface useMeduzaPostsProps {
  initialPosts: FeedProps["initialPosts"];
  totalPosts: FeedProps["totalPosts"];
  take: number;
}

export const useMeduzaPosts = ({
  initialPosts,
  totalPosts,
  take = 5,
}: useMeduzaPostsProps) => {
  return useInfiniteQuery(
    ["feed"],
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      const response = await fetchPosts({ take, skip: pageParam });

      if (!response) {
        throw new Error("Network response was not ok");
      }

      return response;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        // here we calculate the skip param (how many posts we already fetched)
        const skipParam = allPages.flatMap((page) => page.posts).length ?? 0;

        // if we have more posts, we return the skip param, otherwise we return 'undefined',
        // so react query hasNextPage will be false
        // https://tanstack.com/query/v4/docs/react/guides/infinite-queries
        return lastPage?.hasMore ? skipParam : undefined;
      },
      initialData: {
        pages: [{ posts: initialPosts, total: totalPosts, hasMore: true }],
        pageParams: [0], // initial skip param
      },
      // we dont want to refetch this often
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  );
};
