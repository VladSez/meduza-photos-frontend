import dayjs from "dayjs";
import { ImageResponse } from "next/og";
import { z } from "zod";

import { OpenGraphImage } from "@/components/og-image";

import { supabase } from "@/lib/supabase";
import { OpenGraphSchema } from "@/utils/zod-schema";

import "dayjs/locale/ru";

dayjs.locale("ru");

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const interFont = await fetch(
    new URL("../../../fonts/Inter-SemiBold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  // we can't query prisma, because it's not available in the edge runtime
  // so we have to use supabase
  const { data, error } = await supabase
    .from("MeduzaArticles")
    .select("header, dateString, photosWithMeta")
    .eq("id", params.id);

  const posts = z.array(OpenGraphSchema).parse(data);

  const post = posts?.[0];

  const heroBanner = post?.photosWithMeta?.[0];

  if (error) {
    return new Response("Could not load preview", { status: 500 });
  }

  return new ImageResponse(
    (
      <OpenGraphImage
        heroBanner={heroBanner}
        title={post?.header}
        date={post?.dateString}
      />
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interFont,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
