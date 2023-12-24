import { AlertCircle } from "lucide-react";

import { CalendarList } from "@/components/calendar/calendar-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { fetchPosts } from "../actions/fetch-posts";

import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "Календарь",
  description: "Календарь событий войны в Украине.",
};

export default async function Calendar() {
  const { hasError, posts } = await fetchPosts({ take: 10 });

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
    <article>
      <h1 className="mx-auto mb-10 mt-24 max-w-4xl text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:mt-32 lg:text-6xl dark:text-white">
        Хроники войны в Украине
      </h1>
      <p className="mx-auto mb-14 mt-6 max-w-4xl text-center text-lg text-gray-500 dark:text-slate-400">
        Источник:{" "}
        <a
          href="https://meduza.io"
          target="_blank"
          className="text-gray-900 hover:underline"
          rel="noopener"
        >
          meduza.io
        </a>
      </p>
      <main className="md:justify-items-center">
        <CalendarList initialPosts={posts} />
      </main>
    </article>
  );
}
