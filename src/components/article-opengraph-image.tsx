import dayjs from "dayjs";
import { decode } from "html-entities";

import { stripHtmlTags } from "@/utils/strip-html-tags";

import type { OpenGraphSchemaType } from "@/utils/zod-schema";

import "dayjs/locale/ru";

dayjs.locale("ru");

interface ArticleOpenGraphImageProps {
  heroBanner: OpenGraphSchemaType["photosWithMeta"][0] | undefined;
  post: OpenGraphSchemaType | undefined;
}

export function ArticleOpenGraphImage({
  heroBanner,
  post,
}: ArticleOpenGraphImageProps) {
  return (
    <div tw="relative flex w-full h-full items-center justify-center">
      {/* Background */}
      <div tw="absolute flex inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          tw="flex flex-1"
          src={"https://ik.imagekit.io/fl2lbswwo/tr:q-70/" + heroBanner?.img}
          alt={heroBanner?.captionText ?? ""}
        />
        {/* Overlay */}
        <div tw="absolute flex inset-0 bg-black bg-opacity-60" />
      </div>
      <div tw="flex flex-col text-neutral-50 p-16">
        {/* Title */}
        <div tw="text-5xl p-16">{stripHtmlTags(decode(post?.header))}</div>
        <div tw="relative bottom-8 left-16">
          {dayjs(post?.dateString).format("DD MMMM YYYY")}
        </div>
      </div>
    </div>
  );
}
