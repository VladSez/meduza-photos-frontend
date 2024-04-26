"use client";

import { useContext } from "react";

import { ArticleInViewportContext } from "@/app/providers";

export const useArticleInViewportContext = () => {
  return useContext(ArticleInViewportContext);
};
