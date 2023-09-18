import { Timeline } from "./timeline";
import { VirtualizedFeed } from "./virtualized-feed";

import type { TimelineType } from "@/app/feed/page";
import type { PostsSchemaType } from "@/utils/zod-schema";

export interface FeedProps {
  entries: PostsSchemaType;
  timeline: TimelineType;
  totalPosts: number;
}

export function Feed({ entries, timeline, totalPosts }: FeedProps) {
  return (
    <>
      <div className="md:col-span-2"></div>
      <div className="col-span-12 my-14 md:col-span-8">
        <VirtualizedFeed entries={entries} totalPosts={totalPosts} />
      </div>
      <div className="relative hidden justify-center lg:col-span-2 lg:flex">
        <div className="fixed top-20">
          <Timeline timeline={timeline} />
        </div>
      </div>
    </>
  );
}
