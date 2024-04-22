"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import { createContext, useCallback, useMemo, useState } from "react";

import { useToast } from "@/ui/use-toast";

import { toastGenericError } from "@/utils/toast-generic-error";

import type { ReactNode } from "react";

import "dayjs/locale/ru";

dayjs.locale("ru");

type setStateCallback = (arg: string) => void;

type ArticleInViewportContext = {
  articleInViewport: string | null;
  setArticleInViewport: setStateCallback;
  articleDateInViewport: string | null;
  setArticleDateInViewport: setStateCallback;
};

/**
 * We use this to save the article id that is currently in viewport (to highlight the date)
 */
export const ArticleInViewportContext = createContext<ArticleInViewportContext>(
  {
    articleInViewport: null,
    setArticleInViewport: () => {},
    articleDateInViewport: null,
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

type GlobalErrorContextType = {
  globalError: Error | null;
  setError: (error: Error | null) => void;
};

export const GlobalErrorContext = createContext<GlobalErrorContextType>({
  globalError: null,
  setError: () => {},
});

export default function Providers({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [articleInViewport, setArticleInViewport] = useState("");
  const [articleDateInViewport, setArticleDateInViewport] = useState("");
  const [filterDate, setFilterDate] = useState<Date>();
  const [globalError, setError] =
    useState<GlobalErrorContextType["globalError"]>(null);

  const [queryClient] = useState(() => {
    return new QueryClient({
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
            toast(toastGenericError);
          }
        },
      }),
    });
  });

  const setFilterDateHandler = useCallback((filterDate: Date | undefined) => {
    if (filterDate) {
      setFilterDate(filterDate);
    }
  }, []);

  const filterDateContextValue = useMemo(() => {
    return {
      filterDate,
      setFilterDate: setFilterDateHandler,
    };
  }, [filterDate, setFilterDateHandler]);

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

  const articleContextValue = useMemo(() => {
    return {
      articleInViewport,
      setArticleInViewport: setArticleInViewportHandler,
      articleDateInViewport,
      setArticleDateInViewport: setArticleDateInViewportHandler,
    };
  }, [
    articleDateInViewport,
    articleInViewport,
    setArticleDateInViewportHandler,
    setArticleInViewportHandler,
  ]);

  const setErrorHandler = useCallback(
    (error: GlobalErrorContextType["globalError"]) => {
      if (error) {
        setError(error);
      }
    },
    []
  );

  const globalErrorContextValue = useMemo(() => {
    return {
      globalError,
      setError: setErrorHandler,
    };
  }, [globalError, setErrorHandler]);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorContext.Provider value={globalErrorContextValue}>
        <ArticleInViewportContext.Provider value={articleContextValue}>
          <FilterDateContext.Provider value={filterDateContextValue}>
            {children}
          </FilterDateContext.Provider>
        </ArticleInViewportContext.Provider>
      </GlobalErrorContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
