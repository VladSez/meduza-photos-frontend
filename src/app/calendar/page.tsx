import { fetchPosts } from "../actions/fetch-posts";
import { CalendarListClient } from "./_components/calendar-client";

import type { Metadata } from "next";

export const revalidate = 86_400; // revalidate every 24 hours

export const metadata: Metadata = {
  title: "Календарь",
  description: "Календарь событий войны в Украине.",
};

export default async function Calendar() {
  const { posts } = await fetchPosts({ take: 10 });

  return (
    <article className="animate-in fade-in">
      <h1 className="mx-auto mb-10 mt-24 max-w-4xl text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:mt-32 lg:text-6xl">
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
        <CalendarListClient initialPosts={posts} />
      </main>
    </article>
  );
}
