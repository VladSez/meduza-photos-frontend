import { decode } from "html-entities";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Article } from "@/components/article";
import { Banner } from "@/components/ui/banner";

import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/utils/zod-schema";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const article = await prisma.meduzaArticles.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  return {
    title: article?.header ? decode(article.header) : "Post",
  };
}

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

  const _article = PostSchema.parse(article);

  const nextArticleId = await prisma.meduzaArticles.findFirst({
    where: {
      currentLink: article?.nextLink ?? "",
    },
    select: {
      id: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className={`my-16 md:my-[100px]`}>
      <Article article={_article} />

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
