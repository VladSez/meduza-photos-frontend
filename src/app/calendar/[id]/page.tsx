import dayjs from "dayjs";
import { decode } from "html-entities";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { Banner } from "@/ui/banner";

import { Article } from "@/app/components/article";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { stripHtmlTags } from "@/utils/strip-html-tags";
import { PostSchema } from "@/utils/zod-schema";

import type { Metadata } from "next";

const MetaDataSchema = PostSchema.pick({
  header: true,
  subtitle: true,
}).strict();

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata | undefined> {
  try {
    const { data } = await supabase
      .from("MeduzaArticles")
      .select("header, subtitle")
      .eq("id", params.id);

    const posts = z.array(MetaDataSchema).nonempty().parse(data);

    const post = posts?.[0];

    const title = post?.header ? stripHtmlTags(decode(post.header)) : "Пост";
    const description = post?.subtitle ?? "Война в Украине";

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
  // TODO: use supabase to improve performance
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

  if (!article) {
    notFound();
  }

  const previousDayDate = dayjs(article.dateString)
    .subtract(1, "day")
    .format("YYYY/MM/DD");

  // take previous day article from db
  const linkToPreviousArticle = await prisma.meduzaArticles.findFirst({
    where: {
      dateString: previousDayDate,
    },
    select: {
      id: true,
    },
  });

  const previousArticleId = linkToPreviousArticle?.id;
  const parsedArticle = PostSchema.parse(article);

  return (
    <div className={`py-16 md:py-[100px] md:pb-[50px]`}>
      <Article article={parsedArticle} />

      {previousArticleId ? (
        <Banner>
          <p>
            Главные фотографии предыдущего дня войны можно посмотреть по этой{" "}
            <Link href={`/calendar/${previousArticleId}`} className="underline">
              ссылке
            </Link>
          </p>
        </Banner>
      ) : null}
    </div>
  );
}
