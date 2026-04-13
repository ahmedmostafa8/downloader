"use client";

import { useState, useCallback, useRef } from "react";
import type { DownloadState, DownloadResponse } from "../types";

export function useDownload() {
  const [state, setState] = useState<DownloadState>({
    status: "idle",
    data: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const download = useCallback(async (url: string) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState({ status: "loading", data: null, error: null });

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      const result = await response.json();

      if (!result.success) {
        setState({
          status: "error",
          data: null,
          error: result.message || "Download failed. Please try again.",
        });
        return;
      }

      setState({
        status: "success",
        data: result as DownloadResponse,
        error: null,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return; // Silently handle abort
      }

      setState({
        status: "error",
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Network error. Please check your connection.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({ status: "idle", data: null, error: null });
  }, []);

  return {
    ...state,
    download,
    reset,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
  };
}
