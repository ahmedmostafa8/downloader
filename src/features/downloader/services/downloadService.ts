import type { Platform, DownloadResult } from "../types";
import { tiktokProvider } from "../providers";

// ─── URL Validation ─────────────────────────────────────────────────────────

const TIKTOK_REGEX =
  /^https?:\/\/((?:www|vm|vt|m)\.)?tiktok\.com\/.+/i;

export function detectPlatform(url: string): Platform | null {
  if (TIKTOK_REGEX.test(url)) return "tiktok";
  // Future:
  // if (INSTAGRAM_REGEX.test(url)) return "instagram";
  // if (YOUTUBE_REGEX.test(url)) return "youtube";
  return null;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string {
  return url.trim().split("?")[0].split("#")[0];
}

// ─── Download Orchestrator ──────────────────────────────────────────────────

export async function downloadVideo(url: string): Promise<DownloadResult> {
  // Step 1: Basic validation
  if (!url || typeof url !== "string") {
    return {
      success: false,
      message: "Please provide a valid URL.",
      code: "INVALID_URL",
    };
  }

  const cleanUrl = url.trim();

  if (!isValidUrl(cleanUrl)) {
    return {
      success: false,
      message: "The URL you entered is not valid. Please check and try again.",
      code: "INVALID_URL",
    };
  }

  // Step 2: Detect platform
  const platform = detectPlatform(cleanUrl);

  if (!platform) {
    return {
      success: false,
      message:
        "This URL is not supported. Currently, we only support TikTok links.",
      code: "INVALID_URL",
    };
  }

  // Step 3: Route to the correct provider
  try {
    let result;

    switch (platform) {
      case "tiktok":
        result = await tiktokProvider.fetch(cleanUrl);
        break;
      default:
        return {
          success: false,
          message: `${platform} is not yet supported. Stay tuned!`,
          code: "INVALID_URL",
        };
    }

    return {
      success: true,
      videoUrl: result.videoUrl,
      audioUrl: result.audioUrl,
      thumbnail: result.thumbnail,
      title: result.title,
      author: result.author,
      duration: result.duration,
      platform,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred. Please try again.";

    // Detect specific error types
    if (message.includes("private")) {
      return { success: false, message, code: "PRIVATE_VIDEO" };
    }
    if (message.includes("removed") || message.includes("not found")) {
      return { success: false, message, code: "REMOVED_VIDEO" };
    }
    if (message.includes("abort") || message.includes("timeout")) {
      return {
        success: false,
        message: "The request timed out. Please try again.",
        code: "TIMEOUT",
      };
    }

    return { success: false, message, code: "API_FAILED" };
  }
}
