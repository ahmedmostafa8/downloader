"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DownloadForm,
  VideoPlayer,
  AudioPlayer,
  ErrorMessage,
  LoadingSkeleton,
} from "@/features/downloader/components";
import { useDownload } from "@/features/downloader/hooks/useDownload";
import {
  ArrowDownToLine,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

type DownloadMode = "video" | "audio";

export default function HomePage() {
  const { status, data, error, download, reset, isLoading, isSuccess, isError } =
    useDownload();
  const [mode, setMode] = useState<DownloadMode>("video");

  const handleSubmitVideo = (url: string) => {
    setMode("video");
    download(url);
  };

  const handleSubmitAudio = (url: string) => {
    setMode("audio");
    download(url);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        {/* Decorative orbs */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 20, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/3 rounded-full blur-3xl"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header */}
      <header className="w-full border-b border-border/30 backdrop-blur-xl bg-background/60">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
              <ArrowDownToLine className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Snap<span className="text-primary">Save</span>
            </span>
          </motion.div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-6 sm:py-16">
        <div className="w-full max-w-lg space-y-4 sm:space-y-8">
          {/* Hero Section (Hidden on mobile, visible on sm+) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden sm:block text-center space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Download TikTok Videos
              <span className="block text-primary mt-1">Without Watermark</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto">
              Paste any TikTok link to download the video in HD quality,
              completely free and without watermarks.
            </p>
          </motion.div>

          {/* Download Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-border/40 bg-card/50 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/[0.03] dark:shadow-black/[0.2] space-y-5"
          >
            <DownloadForm
              onSubmit={handleSubmitVideo}
              onSubmitAudio={handleSubmitAudio}
              isLoading={isLoading}
              loadingMode={isLoading ? mode : null}
              activeMode={mode}
            />

            {/* Dynamic Content Area */}
            <AnimatePresence mode="wait">
              {isLoading && <LoadingSkeleton key="skeleton" />}
              {isError && error && (
                <ErrorMessage key="error" message={error} onRetry={reset} />
              )}
              {isSuccess && data && mode === "video" && (
                <VideoPlayer key="video" data={data} />
              )}
              {isSuccess && data && mode === "audio" && (
                <AudioPlayer key="audio" data={data} />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Features Grid (Hidden on mobile, visible on sm+) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden sm:grid grid-cols-3 gap-3"
          >
            {[
              {
                icon: <Zap className="h-4.5 w-4.5" />,
                label: "Lightning Fast",
              },
              {
                icon: <Shield className="h-4.5 w-4.5" />,
                label: "No Watermark",
              },
              {
                icon: <Globe className="h-4.5 w-4.5" />,
                label: "HD Quality",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-4 text-center shadow-xl shadow-black/[0.03] dark:shadow-black/[0.2]"
              >
                <div className="text-primary/70">{feature.icon}</div>
                <span className="text-xs font-medium text-muted-foreground">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-background/60 backdrop-blur-xl shrink-0">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground/60">
            <p className="hidden sm:block">
              © {new Date().getFullYear()} SnapSave. Free TikTok video downloader.
            </p>
            <p className="text-center sm:text-right w-full sm:w-auto">
              Made with ❤️ by Ahmed Mostafa
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
