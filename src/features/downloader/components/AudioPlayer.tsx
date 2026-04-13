"use client";

import { useEffect, useRef, useState } from "react";
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
  Music,
} from "lucide-react";
import type { DownloadResponse } from "../types";

interface AudioPlayerProps {
  data: DownloadResponse;
}

export function AudioPlayer({ data }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");

  const proxiedAudio = data.audioUrl ? proxyUrl(data.audioUrl) : "";

  // Track audio progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        const m = Math.floor(audio.currentTime / 60);
        const s = Math.floor(audio.currentTime % 60);
        setCurrentTime(`${m}:${s.toString().padStart(2, "0")}`);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = async () => {
    if (!proxiedAudio) return;
    try {
      const response = await fetch(proxiedAudio);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${data.title || "tiktok-audio"}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      setHasDownloaded(true);
      setTimeout(() => setHasDownloaded(false), 3000);
    } catch {
      window.open(data.audioUrl || "", "_blank");
      setHasDownloaded(true);
      setTimeout(() => setHasDownloaded(false), 3000);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: data.title || "TikTok Audio",
          text: "Download this TikTok audio!",
          url: window.location.href,
        });
      } else if (navigator.clipboard && data.audioUrl) {
        await navigator.clipboard.writeText(data.audioUrl);
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
      {/* Audio Player Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-violet-500/10 to-primary/5 border border-border/30 p-3 sm:p-6">
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={proxiedAudio}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Visualizer UI */}
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          {/* Play/Pause button */}
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 sm:w-20 sm:h-20 flex-shrink-0 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
            ) : (
              <Play className="h-5 w-5 sm:h-8 sm:w-8 text-primary ml-1" />
            )}
          </button>

          {/* Music label */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Music className="h-4 w-4" />
            <span className="text-sm font-medium">Audio Only</span>
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-1.5">
            <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentTime}</span>
              {data.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {data.duration}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          id="save-audio-button"
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
              Audio Saved!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ArrowDown className="h-4.5 w-4.5" />
              Save Audio
            </span>
          )}
        </Button>

        <Button
          id="share-audio-button"
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
