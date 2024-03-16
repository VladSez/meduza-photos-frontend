import type { MeduzaSearchResponse } from "@/types/meduza-search-api";

export async function searchMeduzaApi({
  title,
}: {
  title: string | undefined;
}) {
  const url = `https://meduza.io/api/w5/search?term=${encodeURIComponent(
    title ?? "Фотографии войны"
  )}&page=0&per_page=24&locale=ru`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const meduzaSearchResult = (await res.json()) as MeduzaSearchResponse;

  const docs = Object.values(meduzaSearchResult?.documents);

  const imagesUrls = docs?.map((doc) => {
    return `https://meduza.io${doc.image?.base_urls?.elarge_url}`;
  });

  const randomImage =
    imagesUrls?.[Math.floor(Math.random() * imagesUrls.length)];

  const imgByTitle = docs?.[0]?.image?.base_urls?.elarge_url;

  const imgByTitleUrl = imgByTitle ? `https://meduza.io${imgByTitle}` : null;

  return {
    imagesUrls,
    randomImage,
    imgByTitleUrl: imgByTitleUrl,
  };
}
