import dayjs from "dayjs";
import { ImageResponse } from "next/og";

import { OpenGraphImage } from "@/ui/og-image";

import { getOpenGraphData } from "@/utils/get-opengraph-data";

import "dayjs/locale/ru";

dayjs.locale("ru");

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const alt = "Фотографии войны в Украине";

export default async function Image({ params }: { params: { id: string } }) {
  const res = await getOpenGraphData({ id: params.id });
  const { interFont, banner, post, error } = res;

  if (error) {
    return new Response("Could not fetch response", { status: 500 });
  }

  return new ImageResponse(
    (
      <OpenGraphImage
        heroBanner={banner}
        title={post?.header}
        date={post?.dateString}
      />
    ),
    {
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
