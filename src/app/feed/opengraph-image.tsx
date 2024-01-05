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
export const alt = "Фотографии войны в Украине. Лента событий";

export default async function Image() {
  const interFont = await fetch(
    new URL("../../fonts/Inter-SemiBold.ttf", import.meta.url)
  ).then((res) => {
    return res.arrayBuffer();
  });

  const { data, error } = await supabase
    .from("MeduzaArticles")
    .select("header, dateString, photosWithMeta")
    .limit(10)
    .order("id", { ascending: false });

  const posts = z.array(OpenGraphSchema).parse(data);

  // take random post from posts array
  const randomPost = Math.floor(Math.random() * posts.length);
  const post = posts?.[randomPost];

  const heroBanner = post?.photosWithMeta?.[0];

  if (error) {
    return new Response("Could not load preview", { status: 500 });
  }

  return new ImageResponse(
    (
      <OpenGraphImage
        heroBanner={heroBanner}
        title="Фотографии войны в Украине. Лента событий"
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
