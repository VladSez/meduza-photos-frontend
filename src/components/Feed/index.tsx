"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { memo, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";

import { PostsSchema } from "@/utils/zod-schema";

import { Article } from "../Article";
import { Loading } from "../Loading";
import { Timeline } from "./Timeline";

import type { TimelineType } from "@/app/feed/page";
import type { PostsSchemaType } from "@/utils/zod-schema";
import type { MotionValue } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";

export function Feed({
  entries,
  timeline,
}: {
  entries: PostsSchemaType;
  timeline: TimelineType;
}) {
  const [page, setPage] = useState(1);
  const [articleInViewport, setArticleInViewport] = useState("");

  const { scrollY } = useScroll();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["feed"],
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

  return (
    <>
      <div className="md:col-span-2"></div>
      <div className="col-span-12 my-10 md:col-span-8">
        <Virtuoso
          increaseViewportBy={2000}
          overscan={2000}
          useWindowScroll
          endReached={() => {
            if (!isFetchingNextPage) {
              void fetchNextPage();
            }
          }}
          style={{ height: "100vh" }}
          data={_entries}
          itemsRendered={(range) => {
            // the range has to be exactly 1, to be able to use to calculate the active section
            if (range?.length === 1) {
              // take last id from range
              const articleId = String(range?.[0]?.data?.id) ?? "";

              if (articleInViewport !== articleId) {
                setArticleInViewport(articleId);
              }
            }
          }}
          itemContent={(_, post) => {
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Item
                  post={post}
                  setArticleInViewport={setArticleInViewport}
                  articleInViewport={articleInViewport}
                  scrollY={scrollY}
                />
              </motion.div>
            );
          }}
        />
        {isFetchingNextPage ? (
          <motion.div
            className="my-10 flex flex-col justify-center space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loading />
            <div className="flex justify-center">
              <button
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold leading-6 text-sky-500 shadow"
                onClick={() => fetchNextPage()}
              >
                Загрузить следующие статьи
              </button>
            </div>
          </motion.div>
        ) : null}
      </div>
      <div className="relative hidden justify-center lg:col-span-2 lg:flex">
        <div className="fixed top-20">
          <Timeline
            page={page}
            activeSectionId={Number(articleInViewport)}
            timeline={timeline}
          />
        </div>
      </div>
    </>
  );
}

const Item = memo(function Item({
  post,
  setArticleInViewport,
  articleInViewport,
  scrollY,
}: {
  post: PostsSchemaType[0];
  setArticleInViewport: Dispatch<SetStateAction<string>>;
  articleInViewport: string;
  scrollY: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // calculate the article (articleId), that is currently in viewport
  useMotionValueEvent(scrollY, "change", (windowY) => {
    let newAriticleInViewportId: string | null = null;

    if (
      typeof ref?.current?.offsetTop !== "number" ||
      typeof ref?.current?.offsetHeight !== "number"
    ) {
      return;
    }

    const sectionOffsetTop = ref?.current?.offsetTop - 200;
    const sectionHeight = ref?.current?.offsetHeight;

    if (
      windowY >= sectionOffsetTop &&
      windowY < sectionOffsetTop + sectionHeight
    ) {
      // get the article (id) that is currently in viewport
      newAriticleInViewportId = ref?.current?.id ?? "";
    }

    if (
      newAriticleInViewportId &&
      newAriticleInViewportId !== articleInViewport
    ) {
      setArticleInViewport(newAriticleInViewportId);
    }
  });

  return (
    <div id={String(post.id)} ref={ref}>
      <div>
        <Article article={post} />
      </div>
      <hr className="my-12 h-px w-full bg-gray-200"></hr>
    </div>
  );
});
