import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "SnapSave — Download TikTok Videos Without Watermark",
  description:
    "Free online TikTok video downloader. Download TikTok videos in HD quality without watermark. Fast, easy, and completely free.",
  keywords: [
    "TikTok downloader",
    "download TikTok video",
    "TikTok no watermark",
    "save TikTok video",
    "TikTok video download",
  ],
  openGraph: {
    title: "SnapSave — Download TikTok Videos Without Watermark",
    description:
      "Free online TikTok video downloader. Download TikTok videos in HD quality without watermark.",
    type: "website",
    siteName: "SnapSave",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapSave — Download TikTok Videos Without Watermark",
    description:
      "Free online TikTok video downloader. Download TikTok videos in HD quality without watermark.",
  },
  robots: {
    index: true,
    follow: true,
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        <ThemeProvider>
          {children}
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
