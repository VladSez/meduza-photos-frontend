import dayjs from "dayjs";
import { decode } from "html-entities";

import { stripHtmlTags } from "@/utils/strip-html-tags";

import type { OpenGraphSchemaType } from "@/utils/zod-schema";

import "dayjs/locale/ru";

dayjs.locale("ru");

interface OgImageProps {
  title: OpenGraphSchemaType["header"] | undefined;
  heroBanner: OpenGraphSchemaType["photosWithMeta"][0] | undefined;
  date?: OpenGraphSchemaType["dateString"] | undefined;
}

export function OpenGraphImage({ heroBanner, date, title = "" }: OgImageProps) {
  return (
    <div tw="relative flex w-full h-full items-center justify-center">
      {/* Background */}
      <div tw="absolute flex inset-0">
        {heroBanner?.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            tw="flex flex-1"
            src={`https://ik.imagekit.io/fl2lbswwo/tr:f-png,w-1200,h-630,q-75/${heroBanner?.img}`}
            alt={stripHtmlTags(decode(heroBanner?.captionText)) ?? ""}
          />
        ) : null}
        {/* Overlay */}
        <div tw="absolute flex inset-0 bg-black bg-opacity-60" />
      </div>
      <div tw="flex flex-col text-neutral-50 p-16">
        {/* Title */}
        <div tw="text-5xl p-16">{stripHtmlTags(decode(title))}</div>

        {date ? (
          <div tw="relative bottom-8 left-[66px]">
            {dayjs(date).format("DD MMMM YYYY")}
          </div>
        ) : null}
      </div>
    </div>
  );
}
