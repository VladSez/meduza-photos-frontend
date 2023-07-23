"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { PostsSchema, PostsSchemaType } from "@/utils/zod-schema";

import { Article } from "../Article";
import { Dates } from "./Dates";

export function Feed({ entries }: { entries: PostsSchemaType }) {
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "4000px",
  });

  const { data, fetchNextPage } = useInfiniteQuery(
    ["posts"],
    async ({ pageParam = 1 }: { pageParam?: number }) => {
      //* this function runs only on **CLIENT SIDE**

      setPage(pageParam);

      const response = await fetch(`/api/feed?page=${pageParam}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const validatedData = PostsSchema.parse(await response.json());

      return validatedData;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [entries],
        pageParams: [1],
      },
      // we dont want to refetch this often
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    }
  );

  const _entries = data?.pages.flat() ?? [];

  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <>
      <div className="md:col-span-2"></div>
      <div className="col-span-12 md:col-span-8">
        {_entries.map((post, index) => {
          if (index === _entries.length - 3) {
            return (
              <div className="my-20" key={post.id} ref={ref}>
                <div id={String(post.id)} data-section>
                  <Article article={post} />
                </div>
                <hr className="my-12 h-px w-full bg-gray-200"></hr>
              </div>
            );
          }
          return (
            <div className="my-20" key={post.id}>
              <div id={String(post.id)} data-section>
                <Article article={post} />
              </div>
              <hr className="my-12 h-px w-full bg-gray-200"></hr>
            </div>
          );
        })}
        <button onClick={() => fetchNextPage()}>Fetch next page</button>
      </div>
      <div className="relative hidden justify-center md:col-span-2 md:flex">
        <div className="fixed top-20">
          <Dates entries={_entries} page={page} />
        </div>
      </div>
    </>
  );
}
