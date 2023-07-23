import dayjs from "dayjs";
import { Metadata } from "next";
import Link from "next/link";

import { fetchPosts } from "@/utils/fetch-posts";
import { separateDatesByMonth } from "@/utils/separate-dates-by-month";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "Calendar",
  description: "Photo chronicles of war in Ukraine",
};

export default async function Calendar() {
  const posts = await fetchPosts({ count: 1000 });

  const postsByMonth = separateDatesByMonth(posts);

  return (
    <article>
      <h1 className="mx-auto mb-10 mt-32 max-w-4xl text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
        Chronicles of war in Ukraine
      </h1>
      <p className="mx-auto mb-14 mt-6 max-w-4xl text-center text-lg text-gray-500 dark:text-slate-400">
        Source:{" "}
        <a
          href="https://meduza.io"
          target="_blank"
          className="text-gray-900 hover:underline"
          rel="noopener"
        >
          meduza.io
        </a>
      </p>
      <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:mx-10 md:my-14 md:grid-cols-3 md:justify-items-center">
        {Object.entries(postsByMonth).map(([month, posts]) => (
          <div key={month} className="mx-8 md:my-10">
            <h3 className="my-6 mb-10 text-3xl font-medium text-gray-900 sm:text-4xl">
              {month}
            </h3>
            <ul>
              {posts.map((post) => (
                <li key={post?.id} className={`my-1 text-xl text-gray-900`}>
                  <Link
                    href={`/calendar/${post.id}`}
                    className="hover:underline"
                  >
                    {dayjs(post?.date).format("DD MMMM")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </article>
  );
}
