import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
import { decode } from "html-entities";
import { ImageResponse } from "next/og";
import { z } from "zod";

import { stripHtmlTags } from "@/utils/strip-html-tags";
import { PostSchema } from "@/utils/zod-schema";

import "dayjs/locale/ru";

dayjs.locale("ru");

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  // TODO: use server key? because we use supabase only on server-side
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const OpenGraphSchema = PostSchema.pick({
  header: true,
  dateString: true,
  photosWithMeta: true,
});

const interFont = fetch(
  new URL("../../../public/fonts/Inter-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function Image({ params }: { params: { id: string } }) {
  // TODO: handle error
  // we can't query prisma, because it's not available in the edge runtime
  // so we have to use supabase
  const { data } = await supabase
    .from("MeduzaArticles")
    .select("header, dateString, photosWithMeta")
    .eq("id", params.id);

  const posts = z.array(OpenGraphSchema).parse(data);

  const post = posts?.[0];

  const heroBanner = post?.photosWithMeta?.[0];

  return new ImageResponse(
    (
      <div tw="relative flex w-full h-full flex items-center justify-center">
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
          <div tw="relative bottom-0 left-16">
            {dayjs(post?.dateString).format("DD MMMM YYYY")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interFont,
        },
      ],
    }
  );
}
