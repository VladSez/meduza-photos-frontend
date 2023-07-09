import { Feed } from "@/components/Feed";
import { prisma } from "@/lib/prisma";

export default async function FeedList() {
  const entries = await prisma.meduzaArticles.findMany({
    orderBy: {
      date: "desc",
    },
    take: 10,
  });

  return (
    <>
      <div className="grid grid-cols-12 gap-2 my-5">
        <Feed entries={entries} />
      </div>
    </>
  );
}
