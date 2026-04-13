// ─── Download Types ─────────────────────────────────────────────────────────

export type Platform = "tiktok" | "instagram" | "youtube" | "facebook";

export interface DownloadRequest {
  url: string;
}

export interface DownloadResponse {
  success: true;
  videoUrl: string;
  audioUrl?: string;
  thumbnail?: string;
  title?: string;
  author?: string;
  duration?: string;
  platform: Platform;
}

export interface DownloadError {
  success: false;
  message: string;
  code?: ErrorCode;
}

export type DownloadResult = DownloadResponse | DownloadError;

export type ErrorCode =
  | "INVALID_URL"
  | "PRIVATE_VIDEO"
  | "REMOVED_VIDEO"
  | "API_FAILED"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "UNKNOWN";

// ─── Download History ───────────────────────────────────────────────────────

export interface HistoryItem {
  id: string;
  url: string;
  videoUrl: string;
  thumbnail?: string;
  title?: string;
  author?: string;
  platform: Platform;
  downloadedAt: number;  // timestamp
}

// ─── Provider Interface ─────────────────────────────────────────────────────

export interface ProviderResponse {
  videoUrl: string;
  audioUrl?: string;
  thumbnail?: string;
  title?: string;
  author?: string;
  duration?: string;
}

export interface Provider {
  name: string;
  fetch(url: string): Promise<ProviderResponse>;
}

// ─── Download State ─────────────────────────────────────────────────────────

export type DownloadStatus = "idle" | "loading" | "success" | "error";

export interface DownloadState {
  status: DownloadStatus;
  data: DownloadResponse | null;
  error: string | null;
}
