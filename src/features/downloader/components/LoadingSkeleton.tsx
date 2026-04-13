"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="w-full space-y-4"
    >
      {/* Video skeleton */}
      <div className="rounded-2xl overflow-hidden border border-border/30">
        <Skeleton className="h-[120px] sm:h-[200px] w-full" />
      </div>

      {/* Metadata skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Button skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-14 flex-1 rounded-2xl" />
        <Skeleton className="h-14 w-14 rounded-2xl" />
      </div>

      {/* Pulse animation overlay */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground/60 text-sm">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-primary/40"
        />
        <span>Fetching your video...</span>
      </div>
    </motion.div>
  );
}
