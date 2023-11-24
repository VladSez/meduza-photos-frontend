import dayjs from "dayjs";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/toaster";

import { Navigation } from "../components/navigation";
import Providers from "./providers";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={interLocal.className}>
        <Providers>
          <Navigation />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
