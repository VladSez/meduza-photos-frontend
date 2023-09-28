import { Feed } from "@/components/feed";

import { fetchPosts } from "../actions/fetch-posts";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Лента",
  description: "Фото хроники войны в Украине",
};

export default async function FeedList() {
  const { posts } = await fetchPosts({ take: 1 });

  return (
    <>
      <div className="mb-2 grid grid-cols-12 gap-2 md:my-5">
        <Feed initialPosts={posts} />
      </div>
    </>
  );
}
