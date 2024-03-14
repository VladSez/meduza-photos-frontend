"use client";

let urlEndpoint = "https://ik.imagekit.io/fl2lbswwo";

// TODO: this is not working as expected
// maybe my proxy is blocked. not sure
// Remove?
export default function myImageLoader({
  src,
  width,
  quality = 75,
}: {
  src: string;
  width: number;
  quality: number;
}) {
  if (src[0] === "/") {
    src = src.slice(1);
  }

  const params = [`w-${width}`];

  if (quality) {
    params.push(`q-${quality}`);
  }

  const paramsString = params.join(",");

  if (urlEndpoint[urlEndpoint.length - 1] === "/") {
    urlEndpoint = urlEndpoint.slice(0, Math.max(0, urlEndpoint.length - 1));
  }

  return `${urlEndpoint}/${src}?tr=${paramsString}`;
}
