export type MeduzaSearchResponse = {
  _count: number;
  collection: string[];
  documents: {
    [key: string]: Document;
  };
};

type Document = {
  datetime: number;
  image: Image;
  layout: string;
  mobile_layout: string;
  mobile_theme: string;
  second_title: string;
  tag: {
    name: string;
    path: string;
  };
  title: string;
  url: string;
  version: number;
};

type Image = {
  base_urls: {
    elarge_url: string;
    is1to2: string;
    is1to3: string;
    is1to4: string;
    isMobile: string;
    wh_300_200_url: string;
    wh_405_270_url: string;
  };
  cc: string;
  elarge_url: string;
  gradients: {
    bg_rgb: string;
    text_rgb: string;
  };
  height: number;
  is1to1: string;
  is1to2: string;
  is1to3: string;
  is1to4: string;
  isMobile: string;
  mobile_ratio: number;
  optimised_urls: {
    elarge_url: string;
    is1to2: string;
    is1to3: string;
    is1to4: string;
    isMobile: string;
    wh_300_200_url: string;
    wh_405_270_url: string;
  };
  show: boolean;
  wh_1245_500_url: string;
  wh_300_200_url: string;
  wh_405_270_url: string;
  wh_810_540_url: string;
  width: number;
};
