"use client";

// Error components must be Client Components
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

import { genericErrorToastSonner } from "@/ui/toast";

import { useGlobalErrorAtom } from "@/hooks/use-global-error-context";

import { AlertGenericError } from "../components/alert-generic-error";

export default function Error({
  error,
  // reset,
}: {
  error: Error & { digest?: string };
  // reset: () => void;
}) {
  const [, setError] = useGlobalErrorAtom();

  useEffect(() => {
    if (error) {
      setError(error);
      genericErrorToastSonner();

      // Log the error to an error reporting service
      console.error("feed page error", error);

      Sentry.captureException(error);
    }
  }, [error, setError]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-10">
        <AlertGenericError />
      </div>
    </div>
  );
}
