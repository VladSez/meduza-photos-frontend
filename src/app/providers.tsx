"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { createContext, useCallback, useMemo, useState } from "react";

import type { ReactNode } from "react";

import "dayjs/locale/ru";

import { useToast } from "@/components/ui/use-toast";

dayjs.locale("ru");

type setStateCallback = (arg: string) => void;

type ArticleInViewportContext = {
  articleInViewport: string;
  setArticleInViewport: setStateCallback;
  articleDateInViewport: string;
  setArticleDateInViewport: setStateCallback;
};

/**
 * We use this to save the article id that is currently in viewport (to highlight the date)
 */
export const ArticleInViewportContext = createContext<ArticleInViewportContext>(
  {
    articleInViewport: "",
    setArticleInViewport: () => {},
    articleDateInViewport: "",
    setArticleDateInViewport: () => {},
  }
);

/**
 * We use this to save the date that the user has selected in the date picker (to navigate to article by date)
 */
export const FilterDateContext = createContext<{
  filterDate: Date | undefined;
  setFilterDate: (arg: Date | undefined) => void;
}>({
  filterDate: undefined,
  setFilterDate: () => {}, // noop default callback,
});

export default function Providers({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            // https://tanstack.com/query/v5/docs/react/guides/ssr
            staleTime: 60 * 1000,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof Error) {
              toast({
                variant: "destructive",
                title: "Ошибка",
                description: `Что-то пошло не так: попробуйте позже.`,
              });
            }
          },
        }),
      })
  );

  const [articleInViewport, setArticleInViewport] = useState("");
  const [articleDateInViewport, setArticleDateInViewport] = useState("");
  const [filterDate, setFilterDate] = useState<Date>();

  const setFilterDateHandler = useCallback((filterDate: Date | undefined) => {
    if (filterDate) {
      setFilterDate(filterDate);
    }
  }, []);

  const filterDateContextValue = useMemo(
    () => ({
      filterDate,
      setFilterDate: setFilterDateHandler,
    }),
    [filterDate, setFilterDateHandler]
  );

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

  const articleContextValue = useMemo(
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
      <ArticleInViewportContext.Provider value={articleContextValue}>
        <FilterDateContext.Provider value={filterDateContextValue}>
          {children}
        </FilterDateContext.Provider>
      </ArticleInViewportContext.Provider>
    </QueryClientProvider>
  );
}
