import { Suspense } from "react";

import { TimelineAsync } from "./timeline-async";
import { VirtualizedFeed } from "./virtualized-feed";

import type { PostsSchemaType } from "@/utils/zod-schema";

export interface FeedProps {
  initialPosts: PostsSchemaType;
  totalPosts: number;
}

const TimelinePlaceholder = () => {
  return (
    <div className="relative top-16 mx-7 flex w-full max-w-[136px] animate-pulse md:my-10">
      <div className="flex-1">
        <div className="mb-6 h-4 w-full rounded bg-slate-200"></div>
        <div className="my-4 flex flex-row items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-slate-200"></div>
          <div className="h-2 w-full rounded bg-slate-200"></div>
        </div>
        <div className="my-4 flex flex-row items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-slate-200"></div>
          <div className="h-2 w-full rounded bg-slate-200"></div>
        </div>
        <div className="my-4 flex flex-row items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-slate-200"></div>
          <div className="h-2 w-full rounded bg-slate-200"></div>
        </div>
        <div className="my-4 flex flex-row items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-slate-200"></div>
          <div className="h-2 w-full rounded bg-slate-200"></div>
        </div>
        <div className="my-4 flex flex-row items-center">
          <div className="mr-1 h-3 w-3 rounded-full bg-slate-200"></div>
          <div className="h-2 w-full rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export function Feed({ initialPosts, totalPosts }: FeedProps) {
  return (
    <>
      <div className="md:col-span-2"></div>
      <div className="col-span-12 my-14 md:col-span-8">
        <VirtualizedFeed initialPosts={initialPosts} totalPosts={totalPosts} />
      </div>
      <div className="relative hidden justify-center lg:col-span-2 lg:flex">
        <Suspense fallback={<TimelinePlaceholder />}>
          <div className="fixed top-20">
            <TimelineAsync />
          </div>
        </Suspense>
      </div>
    </>
  );
}
