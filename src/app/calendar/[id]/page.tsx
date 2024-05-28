import { decode } from "html-entities";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Banner } from "@/ui/banner";

import { Article } from "@/app/components/article";
import { prisma } from "@/lib/prisma";
import { stripHtmlTags } from "@/utils/strip-html-tags";
import { PostSchema } from "@/utils/zod-schema";

import type { Metadata } from "next";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata | undefined> {
  try {
    const article = await prisma.meduzaArticles.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    const post = PostSchema.parse(article);

    const title = post?.header ? stripHtmlTags(decode(post.header)) : "Пост";
    const description = post?.subtitle ?? "";

    return {
      title: {
        absolute: title,
      },
      description,
      openGraph: {
        title,
        description,
      },
      twitter: {
        title,
        description,
        card: "summary_large_image",
      },
    };
  } catch (error) {
    console.error(error);
  }
}

export async function generateStaticParams() {
  const ids = await prisma.meduzaArticles.findMany({
    select: {
      id: true,
    },
  });

  const idToString = ids.map(({ id }) => {
    return String(id);
  });

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
      currentLink: article?.nextLink ?? "",
    },
    select: {
      id: true,
    },
  });

  if (!article) {
    notFound();
  }

  const _article = PostSchema.parse(article);

  return (
    <div className={`py-16 md:py-[100px] md:pb-[50px]`}>
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
