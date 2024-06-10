"use client";

// Error components must be Client Components
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

import { genericErrorToastSonner } from "@/ui/toast";

import { AlertGenericError } from "@/app/components/alert-generic-error";
import { useGlobalErrorAtom } from "@/hooks/use-global-error-context";

export default function Error({
  error,
  // reset,
}: {
  error: Error & { digest?: string };
  // reset: () => void;
}) {
  const [, setError] = useGlobalErrorAtom();

  useEffect(() => {
    setError(error);
    genericErrorToastSonner();

    // Log the error to an error reporting service
    console.error("calendar[id] page error", error);

    Sentry.captureException(error);
  }, [error, setError]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-10">
        <AlertGenericError />
      </div>
    </div>
  );
}
