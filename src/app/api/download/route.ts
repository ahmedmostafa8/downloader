import { NextRequest, NextResponse } from "next/server";
import { downloadVideo, detectPlatform, isValidUrl } from "@/features/downloader/services/downloadService";

// ─── Rate Limiting (In-Memory) ──────────────────────────────────────────────

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 15;        // requests per window
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetAt) {
      rateLimit.delete(key);
    }
  }
}, 60_000);

// ─── POST Handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please wait a moment before trying again.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // 2. Parse body
    let body: { url?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
          code: "INVALID_URL",
        },
        { status: 400 }
      );
    }

    const { url } = body;

    // 3. Input sanitization
    if (!url || typeof url !== "string" || url.length > 2048) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid URL.",
          code: "INVALID_URL",
        },
        { status: 400 }
      );
    }

    const sanitizedUrl = url.trim();

    if (!isValidUrl(sanitizedUrl)) {
      return NextResponse.json(
        {
          success: false,
          message: "The URL you entered is not valid.",
          code: "INVALID_URL",
        },
        { status: 400 }
      );
    }

    // 4. Validate platform
    const platform = detectPlatform(sanitizedUrl);
    if (!platform) {
      return NextResponse.json(
        {
          success: false,
          message: "This URL is not supported. Currently, we only support TikTok links.",
          code: "INVALID_URL",
        },
        { status: 400 }
      );
    }

    // 5. Download
    const result = await downloadVideo(sanitizedUrl);

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[API /download] Unhandled error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred. Please try again later.",
        code: "UNKNOWN",
      },
      { status: 500 }
    );
  }
}
