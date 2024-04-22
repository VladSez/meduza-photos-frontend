"use client";

import { AlertGenericError } from "./components/alert-generic-error";

// https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
export default function GlobalError({}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html className="h-full">
      <body className="h-full">
        <div className="flex h-full items-center justify-center">
          <div className="mx-10">
            <AlertGenericError />
          </div>
        </div>
      </body>
    </html>
  );
}
