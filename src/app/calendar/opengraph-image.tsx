import dayjs from "dayjs";
import { ImageResponse } from "next/og";

import { OpenGraphImage } from "@/ui/og-image";

import { getOpenGraphData } from "@/utils/get-opengraph-data";

import "dayjs/locale/ru";

dayjs.locale("ru");

export const runtime = "edge";

export const contentType = "image/png";
export const alt = "Фотографии войны в Украине. Календарь событий";

export default async function Image() {
  const res = await getOpenGraphData();
  const { fonts, banner, error, size } = res;

  if (error) {
    return new Response("Could not fetch response", { status: 500 });
  }

  return new ImageResponse(
    (
      <OpenGraphImage
        heroBanner={banner}
        title="Фотографии войны в Украине. Календарь событий"
      />
    ),
    {
      ...size,
      fonts,
    }
  );
}
