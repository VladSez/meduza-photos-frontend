import dayjs from "dayjs";
import localFont from "next/font/local";

import { Toaster } from "@/ui/toaster";

import { cn } from "@/lib/utils";
import { parseUserAgentHeader } from "@/utils/parse-user-agent-header";

import { Navigation } from "./components/navigation";
import Providers from "./providers";

import type { Metadata, Viewport } from "next";

import "./globals.css";
import "dayjs/locale/ru";

dayjs.locale("ru");

// TODO: move fonts to public folder?
const interLocal = localFont({
  src: [
    {
      path: "../fonts/inter-cyrillic-300-normal.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/inter-cyrillic-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/inter-cyrillic-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/inter-cyrillic-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/inter-cyrillic-800-normal.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "Фотографии войны в Украине | %s",
    default: "Фотографии войны в Украине.",
  },
  description: "Фото хроники войны в Украине.",
  openGraph: {
    title: "Фотографии войны в Украине.",
    description: "Фото хроники войны в Украине.",
  },
  twitter: {
    title: "Фотографии войны в Украине.",
    description: "Фото хроники войны в Украине.",
    card: "summary_large_image",
  },
};

export function generateViewport(): Viewport {
  const { isAppleDevice } = parseUserAgentHeader();

  return {
    width: "device-width",
    initialScale: 1,
    // We want to prevent 'auto zoom' on input focus in iOS. This is not needed on Android.
    // The user is still able to zoom in/out manually on iOS/android device.
    ...(isAppleDevice && {
      maximumScale: 1,
      userScalable: true,
    }),
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAppleDevice } = parseUserAgentHeader();

  return (
    <html lang="ru" className="">
      <body className={cn(interLocal.className, "")}>
        <Providers>
          <Navigation isApple={isAppleDevice} />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
