"use client";

import { motion } from "framer-motion";
import { AlertTriangle, WifiOff, Lock, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ErrorCode } from "../types";

interface ErrorMessageProps {
  message: string;
  code?: ErrorCode;
  onRetry?: () => void;
}

const errorIcons: Record<string, React.ReactNode> = {
  INVALID_URL: <AlertTriangle className="h-5 w-5" />,
  PRIVATE_VIDEO: <Lock className="h-5 w-5" />,
  REMOVED_VIDEO: <Trash2 className="h-5 w-5" />,
  API_FAILED: <WifiOff className="h-5 w-5" />,
  RATE_LIMITED: <AlertTriangle className="h-5 w-5" />,
  TIMEOUT: <WifiOff className="h-5 w-5" />,
  UNKNOWN: <AlertTriangle className="h-5 w-5" />,
};

export function ErrorMessage({ message, code, onRetry }: ErrorMessageProps) {
  const icon = errorIcons[code || "UNKNOWN"] || errorIcons.UNKNOWN;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full rounded-2xl border border-destructive/20 bg-destructive/5 p-4"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-destructive/80">{icon}</div>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-destructive">{message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-destructive hover:text-destructive cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
