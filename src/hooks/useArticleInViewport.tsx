import { useContext } from "react";

import { ArticleInViewportContext } from "@/app/providers";

export const useArticleInViewport = () => {
  return useContext(ArticleInViewportContext);
};
