"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import { createContext, useCallback, useMemo, useState } from "react";

import type { ReactNode } from "react";

import "dayjs/locale/ru";

dayjs.locale("ru");

type setStateCallback = (arg: string) => void;

type ArticleInViewportContext = {
  articleInViewport: string;
  setArticleInViewport: setStateCallback;
  articleDateInViewport: string;
  setArticleDateInViewport: setStateCallback;
};

export const ArticleInViewportContext = createContext<ArticleInViewportContext>(
  {
    articleInViewport: "",
    setArticleInViewport: () => {}, // noop default callback,
    articleDateInViewport: "",
    setArticleDateInViewport: () => {}, // noop default callback,
  }
);

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [articleInViewport, setArticleInViewport] = useState("");
  const [articleDateInViewport, setArticleDateInViewport] = useState("");

  const setArticleInViewportHandler = useCallback(
    (articleId: string | undefined) => {
      if (articleId) {
        setArticleInViewport(articleId);
      }
    },
    []
  );

  const setArticleDateInViewportHandler = useCallback(
    (articleDate: string | undefined) => {
      if (articleDate) {
        setArticleDateInViewport(articleDate);
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      articleInViewport,
      setArticleInViewport: setArticleInViewportHandler,
      articleDateInViewport,
      setArticleDateInViewport: setArticleDateInViewportHandler,
    }),
    [
      articleDateInViewport,
      articleInViewport,
      setArticleDateInViewportHandler,
      setArticleInViewportHandler,
    ]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ArticleInViewportContext.Provider value={contextValue}>
        {children}
      </ArticleInViewportContext.Provider>
    </QueryClientProvider>
  );
}
