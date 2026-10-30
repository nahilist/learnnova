import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Learnnova AI",
  description:
    "An AI tutor made for you. Learn from an AI tutor that understands your pdfs, youtube videos, and recorded lectures.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://learnnova.s3.us-east-1.amazonaws.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://learnnova.s3.us-east-1.amazonaws.com" />
        <link
          rel="preload"
          as="image"
          href="/landing-page-video-poster.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-screen bg-white text-[#111111] antialiased selection:bg-neutral-200">
        {children}
      </body>
    </html>
  );
}
