import dayjs from "dayjs";
import { decode } from "html-entities";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { stripHtmlTags } from "@/utils/strip-html-tags";

import type { PostsSchemaType } from "@/utils/zod-schema";

export const CalendarDayCard = ({
  post,
  index,
}: {
  post: PostsSchemaType[0];
  index: number;
}) => {
  const banner = post?.photosWithMeta[0];

  // we extract the date from the header html
  const subtitle = post?.header?.match(/<span>(.*?)<\/span>/)?.[0];

  // we have some images with "bad" urls, so we need to fix them
  const photoURL = banner?.img?.replace("//impro", "/impro");

  return (
    <Link
      href={`/calendar/${post.id}`}
      className="relative"
      key={post?.id}
      data-testid={`calenday-day-card-link-${index}`}
    >
      <div
        className={`h-[530px] max-h-[530px] w-full max-w-full rounded-lg border text-xl text-gray-900 transition-all hover:bg-slate-100`}
      >
        <div className="relative h-[280px] w-full rounded-lg bg-gray-200">
          <Image
            src={photoURL}
            alt={banner?.captionText ?? ""}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="rounded-lg rounded-b-none"
          />
        </div>
        <div className="mx-5 my-3">
          <div
            className={cn(`line-clamp-6 font-semibold text-gray-900`, {
              // we use 'line-clamp-4' when there is a subtitle
              "line-clamp-4": subtitle,
            })}
            dangerouslySetInnerHTML={{
              __html: post?.header,
            }}
            title={stripHtmlTags(decode(post?.header))}
          />

          {subtitle ? (
            <div
              className="line-clamp-3 font-light"
              dangerouslySetInnerHTML={{
                __html: subtitle,
              }}
              title={stripHtmlTags(decode(subtitle))}
            />
          ) : null}

          <p className="absolute bottom-3 text-base text-gray-800">
            {dayjs(post?.date).format("DD MMMM YYYY")}
          </p>
        </div>
      </div>
    </Link>
  );
};
