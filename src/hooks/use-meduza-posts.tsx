"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchPosts } from "@/app/actions/fetch-posts";

import type { FeedProps } from "@/app/feed/_components/feed-client";

interface useMeduzaPostsProps {
  initialPosts: FeedProps["initialPosts"];
  take: number;
  key: string;
}

export const useMeduzaPosts = ({
  initialPosts,
  take = 5,
  key = "",
}: useMeduzaPostsProps) => {
  if (!key) {
    throw new Error("key is required");
  }

  return useInfiniteQuery({
    queryKey: [key, take],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      const response = await fetchPosts({ take, page: pageParam });

      if (!response) {
        throw new Error("Network response was not ok");
      }

      return response;
    },
    getNextPageParam: (lastPage) => {
      // if we have more posts, we return the next page, otherwise we return 'undefined',
      // so react query `hasNextPage` prop will be false
      // https://tanstack.com/query/v4/docs/react/guides/infinite-queries
      return lastPage?.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
    initialData: {
      pages: [
        {
          posts: initialPosts,
          hasMore: true,
          nextPage: 2,
          hasError: false,
        },
      ],
      pageParams: [1], // initial page param
    },
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
