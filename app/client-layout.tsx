"use client";

import type React from "react";

import {
  Imperial_Script,
  Quicksand,
  EB_Garamond,
  Ballet,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// <CHANGE> Configure Google Fonts with Vietnamese language support
const imperialScript = Imperial_Script({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-imperial-script",
  display: "swap",
});

const quicksand = Quicksand({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-quicksand",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const ballet = Ballet({
  weight: ["400"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-ballet",
  display: "swap",
});

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();

  return (
    <>
      <div
        className={`font-sans ${imperialScript.variable} ${quicksand.variable} ${ebGaramond.variable} ${ballet.variable}`}
      >
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </div>
      <Analytics />
    </>
  );
}
