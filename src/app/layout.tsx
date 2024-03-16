import dayjs from "dayjs";
import localFont from "next/font/local";

import { Toaster } from "@/ui/toaster";

import { cn } from "@/lib/utils";

import Providers from "./providers";

import type { Metadata } from "next";

import "dayjs/locale/ru";

import { Navigation } from "./components/navigation";

import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="">
      <body className={cn(interLocal.className, "")}>
        <Providers>
          <Navigation />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
