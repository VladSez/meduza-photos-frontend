import { CalendarList } from "@/components/Calendar";
import { fetchPosts } from "@/utils/fetch-posts";

import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "Calendar",
  description: "Photo chronicles of war in Ukraine",
};

export default async function Calendar() {
  const posts = await fetchPosts({ count: 40 });

  return (
    <article>
      <h1 className="mx-auto mb-10 mt-32 max-w-4xl text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
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
        <CalendarList entries={posts} />
      </main>
    </article>
  );
}
