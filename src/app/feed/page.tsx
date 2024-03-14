import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";

import { fetchPosts } from "../actions/fetch-posts";
import { FeedClient } from "./_components/feed-client";
import { TimelineServer } from "./_components/timeline-server";

import type { Metadata } from "next";

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

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "Лента",
  description: "Лента событий войны в Украине.",
};

export default async function FeedList() {
  const { posts, hasError } = await fetchPosts({ take: 2 });

  if (hasError) {
    return (
      <div className="mx-10 mt-24">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            Что-то пошло не так. Попробуйте позже.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 grid grid-cols-12 gap-2 md:my-5">
        <div className="md:col-span-2"></div>
        <div className="col-span-12 my-14 lg:col-span-8">
          <FeedClient initialPosts={posts} />
        </div>
        <div className="relative hidden justify-center lg:col-span-2 lg:flex">
          <Suspense fallback={<TimelinePlaceholder />}>
            <TimelineServer />
          </Suspense>
        </div>
      </div>
    </>
  );
}
