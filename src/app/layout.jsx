import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RailX - Indian Railway Booking System",
  description: "Book train tickets online with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
