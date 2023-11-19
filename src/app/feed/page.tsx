import { AlertCircle } from "lucide-react";

import { Feed } from "@/components/feed";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { fetchPosts } from "../actions/fetch-posts";

import type { Metadata } from "next";

export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  title: "Лента",
  description: "Фото хроники войны в Украине",
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
        <Feed initialPosts={posts} />
      </div>
    </>
  );
}
