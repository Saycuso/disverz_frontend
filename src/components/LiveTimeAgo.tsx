"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

export function LiveTimeAgo({ timestamp }: { timestamp: string }) {
  // The invisible tick state that forces the component to recalculate
  const [, setTick] = useState(0);

  useEffect(() => {
    // Update every 60 seconds
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Your exact formatting logic!
  const formattedTime = formatDistanceToNow(new Date(timestamp), {
    addSuffix: false,
  })
    .replace("less than a minute", "1m")
    .replace("about ", "")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" h", "h")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" m", " m")
    .replace("less than a minute", "1m"); // Just in case!

  // It just spits out the raw text (like "1m" or "2h")
  return <>{formattedTime}</>;
}