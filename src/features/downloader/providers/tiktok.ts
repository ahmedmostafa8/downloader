import type { Provider, ProviderResponse } from "../types";

// ─── TikWM Provider (Primary) ────────────────────────────────────────────────

const TIKWM_BASE = "https://www.tikwm.com";

/**
 * TikWM sometimes returns relative URLs (e.g. "/video/media/hdplay/xxx.mp4").
 * This helper ensures every URL is absolute so the browser doesn't try to
 * fetch it from the app's own origin.
 */
function resolveUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  // Relative path → prepend TikWM origin
  return `${TIKWM_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
}

interface TikWMResponse {
  code: number;
  msg: string;
  data: {
    play: string;          // no-watermark video URL
    hdplay?: string;       // HD no-watermark video URL
    music: string;         // audio-only URL (relative, often 403s)
    music_info?: {
      play: string;        // direct TikTok CDN audio URL
    };
    cover: string;         // thumbnail
    title: string;
    author: {
      nickname: string;
    };
    duration: number;      // seconds
  };
}

async function fetchFromTikWM(url: string): Promise<ProviderResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${TIKWM_BASE}/api/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: new URLSearchParams({
        url,
        count: "12",
        cursor: "0",
        web: "1",
        hd: "1",
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`TikWM returned status ${response.status}`);
    }

    const json: TikWMResponse = await response.json();

    if (json.code !== 0 || !json.data) {
      throw new Error(json.msg || "TikWM returned invalid response");
    }

    const rawVideo = json.data.hdplay || json.data.play;
    if (!rawVideo) {
      throw new Error("No video URL found in TikWM response");
    }

    const videoUrl = resolveUrl(rawVideo)!;
    
    // Prefer direct CDN URL from music_info to avoid Cloudflare 403s on TikWM
    const rawAudio = json.data.music_info?.play || json.data.music;
    const audioUrl = resolveUrl(rawAudio);
    
    const thumbnail = resolveUrl(json.data.cover);

    const minutes = Math.floor(json.data.duration / 60);
    const seconds = json.data.duration % 60;

    console.log("[TikWM] Resolved video URL:", videoUrl);
    console.log("[TikWM] Resolved audio URL:", audioUrl);

    return {
      videoUrl,
      audioUrl,
      thumbnail,
      title: json.data.title || "TikTok Video",
      author: json.data.author?.nickname || "Unknown",
      duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ─── SnapTik-like Fallback Provider ──────────────────────────────────────────

async function fetchFromFallback(url: string): Promise<ProviderResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const apiUrl = `https://tikcdn.io/ssstik/${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Fallback API returned status ${response.status}`);
    }

    // This endpoint returns video directly - we use the URL itself
    return {
      videoUrl: apiUrl,
      title: "TikTok Video",
      author: "Unknown",
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ─── TikTok Provider Export ──────────────────────────────────────────────────

export const tiktokProvider: Provider = {
  name: "TikTok",
  async fetch(url: string): Promise<ProviderResponse> {
    // Try primary API first
    try {
      return await fetchFromTikWM(url);
    } catch (primaryError) {
      console.warn("[TikTok] Primary API (TikWM) failed:", primaryError);
    }

    // Try fallback
    try {
      return await fetchFromFallback(url);
    } catch (fallbackError) {
      console.warn("[TikTok] Fallback API failed:", fallbackError);
    }

    throw new Error(
      "All TikTok download providers failed. The video may be private, removed, or the service is temporarily unavailable."
    );
  },
};
