import { Article } from "@/components/Article";
import { Banner } from "@/components/Banner";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const ids = await prisma.meduzaArticles.findMany({
    select: {
      id: true,
    },
  });

  const idToString = ids.map(({ id }) => String(id));

  return idToString;
}

export default async function Page({ params }: { params: { id: string } }) {
  const article = await prisma.meduzaArticles.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  const nextArticleId = await prisma.meduzaArticles.findFirst({
    where: {
      currentLink: article?.nextLink,
    },
    select: {
      id: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className={`text-gray-900 my-10`}>
      <Article article={article} />

      {nextArticleId?.id ? (
        <Banner>
          <p>
            Главные фотографии предыдущего дня войны можно посмотреть по этой{" "}
            <Link href={`/calendar/${nextArticleId?.id}`} className="underline">
              ссылке
            </Link>
          </p>
        </Banner>
      ) : null}
    </div>
  );
}
