import { Inter } from "next/font/google";

import { Navigation } from "../components/Navigation";
import Providers from "./providers";

import "dayjs/locale/ru";
import "./globals.css";

import dayjs from "dayjs";

dayjs.locale("ru");

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
