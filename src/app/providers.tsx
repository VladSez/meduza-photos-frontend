"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import { Provider } from "jotai";
import { useState } from "react";

import { useToast } from "@/ui/use-toast";

import { toastGenericError } from "@/utils/toast-generic-error";

import type { ReactNode } from "react";

import "dayjs/locale/ru";

dayjs.locale("ru");

export default function Providers({ children }: { children: ReactNode }) {
  const { toast } = useToast();

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

  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Uncomment if we need to debug react-query queries or mutation */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </Provider>
  );
}
