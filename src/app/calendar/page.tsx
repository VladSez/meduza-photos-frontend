import { fetchPosts } from "@/utils/fetch-posts";
import { separateDatesByMonth } from "@/utils/separate-dates-by-month";
import dayjs from "dayjs";
import { Metadata } from "next";
import Link from "next/link";

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
      <h1 className="text-gray-900 font-extrabold text-4xl mx-auto max-w-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white mt-32 mb-10">
        Chronicles of war in Ukraine
      </h1>
      <p className="mt-6 mb-14 text-lg text-gray-500 text-center max-w-4xl mx-auto dark:text-slate-400">
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
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:my-14 md:mx-10 md:justify-items-center">
        {Object.entries(postsByMonth).map(([month, posts]) => (
          <div key={month} className="mx-8 md:my-10">
            <h3 className="text-3xl sm:text-4xl font-medium my-6 mb-10 text-gray-900">
              {month}
            </h3>
            <ul>
              {posts.map((post) => (
                <li key={post?.id} className={`text-xl text-gray-900 my-1`}>
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
