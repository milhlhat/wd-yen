import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClientLayout } from "./client-layout"

export const metadata: Metadata = {
  title: "Thiệp mời Đám cưới Minh Nhật & Ngọc Yến",
  description: "26-10-2025 l Chúng mình cưới ♥",
  openGraph: {
    title: "Thiệp mời Đám cưới Minh Nhật & Ngọc Yến",
    description: "26-10-2025 l Chúng mình cưới ♥",
    type: "website",
    images: [
      "web-thumb.jpg",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiệp mời Đám cưới Minh Nhật & Ngọc Yến",
    description: "26-10-2025 l Chúng mình cưới ♥",
    images: [
      "web-thumb.jpg",
    ],
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect fill='white' width='64' height='64'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-size='40' font-family='-apple-system, BlinkMacSystemFont, %22Segoe UI%22, Roboto, Helvetica, Arial, sans-serif' fill='%23e11d48'%3E%E2%99%A5%3C/text%3E%3C/svg%3E",
        type: "image/svg+xml",
        rel: "icon",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
