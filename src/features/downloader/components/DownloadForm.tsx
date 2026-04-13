"use client";

import { useState, type FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Download,
  Loader2,
  Clipboard,
  X,
  Sparkles,
  Link2,
  Music,
} from "lucide-react";

type DownloadMode = "video" | "audio";

interface DownloadFormProps {
  onSubmit: (url: string) => void;
  onSubmitAudio: (url: string) => void;
  isLoading: boolean;
  loadingMode: DownloadMode | null;
  activeMode: DownloadMode;
}

export function DownloadForm({
  onSubmit,
  onSubmitAudio,
  isLoading,
  loadingMode,
  activeMode,
}: DownloadFormProps) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Auto-fill and download from Web Share Target
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const text = searchParams.get("text") || "";
      const urlParam = searchParams.get("url") || "";
      
      const combinedStrings = `${text} ${urlParam}`;
      const urlMatch = combinedStrings.match(/https?:\/\/[^\s]+/);
      
      if (urlMatch && urlMatch[0]) {
        const extractedUrl = urlMatch[0];
        setUrl(extractedUrl);
        // We do NOT auto-submit so the user can choose video/audio themselves!
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitVideo = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  const handleSubmitAudio = () => {
    if (url.trim() && !isLoading) {
      onSubmitAudio(url.trim());
    }
  };

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard) {
        alert("Paste button requires HTTPS! Please paste manually since you are testing on your local IP.");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch {
      alert("Please allow clipboard permissions or paste manually.");
    }
  };

  const isVideoLoading = isLoading && loadingMode === "video";
  const isAudioLoading = isLoading && loadingMode === "audio";

  // Swap primary/outline based on which mode is active
  const videoPrimary = activeMode === "video";
  const audioPrimary = activeMode === "audio";

  return (
    <div className="w-full space-y-3">
      {/* Download Form */}
      <form onSubmit={handleSubmitVideo} className="flex flex-col gap-3">
        <div
          className={`relative flex items-center rounded-2xl border-2 transition-all duration-300 bg-background/50 backdrop-blur-sm ${
            isFocused
              ? "border-primary/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
              : "border-border/50 hover:border-border"
          }`}
        >
          <Link2 className="absolute left-4 h-4.5 w-4.5 text-muted-foreground/60" />
          <Input
            id="tiktok-url-input"
            type="url"
            placeholder="Paste TikTok link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            className="flex-1 border-0 bg-transparent pl-11 pr-12 py-6 text-base placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-3 p-1.5 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
            title="Paste from clipboard"
          >
            <Clipboard className="h-4 w-4" />
          </button>
        </div>

        {/* Two action buttons — active one gets primary style */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            id="download-video-button"
            type="submit"
            disabled={!url.trim() || isLoading}
            variant={videoPrimary ? "default" : "outline"}
            size="lg"
            className="flex-1 h-auto min-h-[60px] py-4 px-4 sm:px-6 rounded-2xl text-base font-semibold transition-all duration-300 cursor-pointer disabled:opacity-40"
          >
            {isVideoLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="h-4.5 w-4.5" />
                Download Video
              </span>
            )}
          </Button>

          <Button
            id="download-audio-button"
            type="button"
            onClick={handleSubmitAudio}
            disabled={!url.trim() || isLoading}
            variant={audioPrimary ? "default" : "outline"}
            size="lg"
            className="flex-1 h-auto min-h-[60px] py-4 px-4 sm:px-6 rounded-2xl text-base font-semibold transition-all duration-300 cursor-pointer disabled:opacity-40"
          >
            {isAudioLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Music className="h-4.5 w-4.5" />
                Download Audio
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
