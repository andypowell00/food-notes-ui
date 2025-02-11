import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react'
import Providers from "./providers";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Food Diary",
  description: "Track your meals and symptoms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.className} antialiased dark:bg-dark-base dark:text-dark-primary text-sm leading-relaxed`}
      >
        <Providers><Suspense>{children}</Suspense></Providers>
      </body>
    </html>
  );
}
