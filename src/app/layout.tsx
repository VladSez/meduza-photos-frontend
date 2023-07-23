import { Inter } from "next/font/google";

import { Navigation } from "../components/Navigation";
import Providers from "./providers";

import "./globals.css";

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
