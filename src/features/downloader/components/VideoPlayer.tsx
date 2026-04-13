"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { proxyUrl } from "@/lib/utils";
import {
  Share2,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  ArrowDown,
} from "lucide-react";
import type { DownloadResponse } from "../types";

interface VideoPlayerProps {
  data: DownloadResponse;
}

export function VideoPlayer({ data }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const proxiedVideo = proxyUrl(data.videoUrl);
  const proxiedPoster = data.thumbnail ? proxyUrl(data.thumbnail) : undefined;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(proxiedVideo);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.title || "tiktok-video"}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setHasDownloaded(true);
      setTimeout(() => setHasDownloaded(false), 3000);
    } catch {
      window.open(data.videoUrl, "_blank");
      setHasDownloaded(true);
      setTimeout(() => setHasDownloaded(false), 3000);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: data.title || "TikTok Video",
          text: "Download this TikTok video without watermark!",
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(data.videoUrl);
        alert("Link copied to clipboard!");
      } else {
        alert("Sharing requires HTTPS. Please deploy or test on localhost.");
      }
    } catch {
      alert("Sharing cancelled or not supported on this connection (HTTPS required).");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full space-y-4"
    >
      {/* Video Preview Container */}
      <div className="relative group rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-border/30">
        <div className="relative w-full">
          <video
            ref={videoRef}
            src={proxiedVideo}
            poster={proxiedPoster}
            className="w-full h-auto rounded-2xl"
            playsInline
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Play/Pause Overlay */}
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isPlaying ? 0 : 1 }}
              className="w-16 h-16 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md flex items-center justify-center shadow-2xl"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-foreground" />
              ) : (
                <Play className="h-6 w-6 text-foreground ml-1" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Video Duration Overlay */}
        {data.duration && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1 text-white text-sm font-medium flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {data.duration}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          id="save-video-button"
          onClick={handleDownload}
          disabled={hasDownloaded}
          size="lg"
          className={`flex-1 h-auto min-h-[60px] py-4 px-4 sm:px-6 rounded-2xl text-base font-semibold transition-all duration-300 cursor-pointer disabled:opacity-100 ${
            hasDownloaded
              ? "bg-green-500 hover:bg-green-600 text-white"
              : ""
          }`}
        >
          {hasDownloaded ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5" />
              Video Saved!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ArrowDown className="h-4.5 w-4.5" />
              Save Video
            </span>
          )}
        </Button>

        <Button
          id="share-button"
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="h-auto min-h-[60px] py-4 rounded-2xl px-5 cursor-pointer"
        >
          <Share2 className="h-4.5 w-4.5" />
        </Button>
      </div>
    </motion.div>
  );
}
