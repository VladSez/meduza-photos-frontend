import { decode } from "html-entities";
import { z } from "zod";

import { supabase } from "@/lib/supabase";

import { searchMeduzaApi } from "./search-meduza-api";
import { stripHtmlTags } from "./strip-html-tags";
import { OpenGraphSchema } from "./zod-schema";

import type { PostgrestError } from "@supabase/supabase-js";

export async function getOpenGraphData({ id }: { id?: string } = {}) {
  const interFont = await fetch(
    new URL("../fonts/Inter-SemiBold.ttf", import.meta.url)
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

  if (!heroBanner) {
    return { banner: undefined, post: undefined, interFont, error: true };
  }

  const postHeaderWithoutHTML = stripHtmlTags(decode(post?.header));

  // meduza has api for search (used on their website)
  const { randomImage, imgByTitleUrl } = await searchMeduzaApi({
    title: id ? postHeaderWithoutHTML : undefined,
  });

  // if id is not provided, we take random image from meduza api search results
  // if id is provided, we take image by title (we use search meduza api to find post image by title)
  const ogImage = id ? imgByTitleUrl ?? "" : randomImage ?? "";

  const banner = {
    ...heroBanner,
    img: ogImage,
  } satisfies {
    img?: string;
    title?: string[];
    subTitle?: string[];
    captionText?: string | null;
    credit?: string | null;
  };

  return { banner, post, interFont, error: topError || !heroBanner };
}
