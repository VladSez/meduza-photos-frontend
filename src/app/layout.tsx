import { Navigation } from "../components/Navigation";
import Providers from "./providers";

import "dayjs/locale/ru";
import "./globals.css";

import dayjs from "dayjs";
import localFont from "next/font/local";

dayjs.locale("ru");

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
        </Providers>
      </body>
    </html>
  );
}
