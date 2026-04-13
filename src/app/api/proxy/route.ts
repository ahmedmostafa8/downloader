import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy route to stream media from external URLs (tikwm, etc.)
 * Bypasses CORS restrictions for <video>/<audio> elements.
 *
 * Usage: /api/proxy?url=https://www.tikwm.com/video/media/...
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Only allow proxying from trusted domains
  const allowedDomains = ["tikwm.com", "tiktokcdn.com", "tiktokcdn-us.com", "tikcdn.io"];
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const isAllowed = allowedDomains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );

  if (!isAllowed) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.tikwm.com/",
        Accept: "*/*",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: response.status }
      );
    }

    // Read full body as buffer for reliability
    const buffer = await response.arrayBuffer();

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 502 }
    );
  }
}
