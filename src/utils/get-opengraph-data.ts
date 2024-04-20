import { z } from "zod";

import { supabase } from "@/lib/supabase";

import { OpenGraphSchema } from "./zod-schema";

import type { PostgrestError } from "@supabase/supabase-js";
import type { OpenGraphSchemaType } from "./zod-schema";

type FontOptions = {
  name: string;
  data: ArrayBuffer;
  style: string;
  weight: number;
}[];

type Size = {
  width: number;
  height: number;
};

export async function getOpenGraphData({ id }: { id?: string } = {}) {
  const interFont = await fetch(
    new URL("../fonts/Inter-Bold.ttf", import.meta.url)
  ).then((res) => {
    return res.arrayBuffer();
  });

  let parsedData;
  let topError: PostgrestError | null = null;

  if (id) {
    const { data, error } = await supabase
      .from("MeduzaArticles")
      .select("header, dateString, photosWithMeta")
      .eq("id", id);

    parsedData = z.array(OpenGraphSchema).parse(data);
    topError = error;
  } else {
    const { data, error } = await supabase
      .from("MeduzaArticles")
      .select("header, dateString, photosWithMeta")
      .limit(10)
      .order("id", { ascending: false });

    parsedData = z.array(OpenGraphSchema).parse(data);
    topError = error;
  }

  const posts = parsedData;

  // take random post from posts array
  const randomPost = Math.floor(Math.random() * posts.length);
  const post = posts?.[randomPost];

  const heroBanner = post?.photosWithMeta?.[0];

  const fonts = [
    {
      name: "Inter",
      data: interFont,
      style: "normal",
      weight: 600,
    },
  ] as const satisfies FontOptions;

  const size = {
    width: 1200,
    height: 630,
  } as const satisfies Size;

  return {
    banner: heroBanner,
    post,
    error: Boolean(topError),
    fonts,
    size,
  } satisfies {
    banner: OpenGraphSchemaType["photosWithMeta"][0] | undefined;
    post: OpenGraphSchemaType | undefined;
    error: boolean;
    fonts: FontOptions;
    size: Size;
  };
}
