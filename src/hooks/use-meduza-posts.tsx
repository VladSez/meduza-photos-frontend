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
    throw new Error("key is required for useInfiniteQuery");
  }

  return useInfiniteQuery({
    queryKey: [key, take],
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      try {
        const response = await fetchPosts({
          take,
          page: pageParam,
          isServerAction: true,
        });

        if (!response) {
          throw new Error("Network response was not ok");
        }

        return response;
      } catch (error) {
        console.error(error);

        throw new Error("smth went wrong");
      }
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
        } satisfies Awaited<ReturnType<typeof fetchPosts>>,
      ],
      pageParams: [1], // initial page param
    },
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
