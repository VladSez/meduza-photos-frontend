"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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

type FilterDateContextType = {
  filterDate: Date | undefined;
  setFilterDate: (arg: Date | undefined) => void;
};
/**
 * We use this to save the date that the user has selected in the date picker (to navigate to article by date)
 */
export const FilterDateContext = createContext<FilterDateContextType>({
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

type LastAvailableDateContextType = {
  lastAvailablePostDate: Date | null;
  setLastAvailablePostDate: (date: Date) => void;
};

/* We use this in calendar to enable all available dates */
export const LastAvailablePostDateContext =
  createContext<LastAvailableDateContextType>({
    lastAvailablePostDate: null,
    setLastAvailablePostDate: () => {},
  });

export default function Providers({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [articleInViewport, setArticleInViewport] = useState("");
  const [articleDateInViewport, setArticleDateInViewport] = useState("");
  const [filterDate, setFilterDate] = useState<Date>();
  const [globalError, setError] =
    useState<GlobalErrorContextType["globalError"]>(null);
  const [lastAvailablePostDate, setLastAvailablePostDate] =
    useState<LastAvailableDateContextType["lastAvailablePostDate"]>(null);

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
    } satisfies FilterDateContextType;
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
    } satisfies ArticleInViewportContext;
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
    } satisfies GlobalErrorContextType;
  }, [globalError, setErrorHandler]);

  const setLastAvailableDateHandler = useCallback(
    (
      lastAvailablePostDate: LastAvailableDateContextType["lastAvailablePostDate"]
    ) => {
      if (lastAvailablePostDate) {
        setLastAvailablePostDate(lastAvailablePostDate);
      }
    },
    []
  );

  const lastAvailablePostDateContextValue = useMemo(() => {
    return {
      lastAvailablePostDate,
      setLastAvailablePostDate: setLastAvailableDateHandler,
    } satisfies LastAvailableDateContextType;
  }, [lastAvailablePostDate, setLastAvailableDateHandler]);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorContext.Provider value={globalErrorContextValue}>
        <ArticleInViewportContext.Provider value={articleContextValue}>
          <FilterDateContext.Provider value={filterDateContextValue}>
            <LastAvailablePostDateContext.Provider
              value={lastAvailablePostDateContextValue}
            >
              {children}
            </LastAvailablePostDateContext.Provider>
          </FilterDateContext.Provider>
        </ArticleInViewportContext.Provider>
      </GlobalErrorContext.Provider>
      {/* Uncomment if we need to debug react-query queries or mutation */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
