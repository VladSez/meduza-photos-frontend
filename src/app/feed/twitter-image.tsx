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
export const alt = "Фотографии войны в Украине. Лента событий";

export default async function Image() {
  const res = await getOpenGraphData();
  const { interFont, banner, error } = res;

  if (error) {
    return new Response("Could not fetch response", { status: 500 });
  }

  return new ImageResponse(
    (
      <OpenGraphImage
        heroBanner={banner}
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
