import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Wraps an external media URL through our /api/proxy route
 * to bypass CORS restrictions on <video> and <audio> elements.
 */
export function proxyUrl(url: string): string {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
}
