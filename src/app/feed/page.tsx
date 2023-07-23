import { Metadata } from "next";

import { Feed } from "@/components/Feed";

import { fetchPosts } from "@/utils/fetch-posts";

export const metadata: Metadata = {
  title: "Feed",
  description: "Photo chronicles of war in Ukraine",
};

export default async function FeedList() {
  const entries = await fetchPosts({ count: 5 });

  return (
    <>
      <div className="my-5 grid grid-cols-12 gap-2">
        <Feed entries={entries} />
      </div>
    </>
  );
}
