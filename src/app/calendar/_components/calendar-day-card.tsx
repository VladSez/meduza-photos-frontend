import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

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
  const headerDateContent = post?.header?.match(/<span>(.*?)<\/span>/)?.[0];

  return (
    <Link
      href={`/calendar/${post.id}`}
      className="relative"
      key={post?.id}
      data-testid={`calenday-day-card-link-${index}`}
    >
      <div
        className={`h-[530px] max-h-[530px] w-full max-w-full rounded-lg border text-xl text-gray-900 transition-all hover:bg-slate-100 md:w-[350px]`}
      >
        <div className="relative h-[280px] w-full rounded-lg bg-gray-200">
          <Image
            src={banner?.img}
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
            className={`line-clamp-4 font-semibold`}
            dangerouslySetInnerHTML={{
              __html: post?.header,
            }}
          />

          {headerDateContent ? (
            <div
              className="line-clamp-3 font-light"
              dangerouslySetInnerHTML={{
                __html: headerDateContent,
              }}
            />
          ) : null}

          <p className="absolute bottom-3 text-base">
            {dayjs(post?.date).format("DD MMMM YYYY")}
          </p>
        </div>
      </div>
    </Link>
  );
};
