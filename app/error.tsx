"use client";

import { useEffect } from "react";
import ServerMaintenance from "@/components/ServerMaintenance";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js App Router error boundary.
 * Place this file at any route segment, e.g.:
 *   app/error.tsx          ← catches all routes
 *   app/(kiosk)/error.tsx  ← catches only that layout group
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to your error-tracking service here (Sentry, Datadog, etc.)
    console.error("[ErrorBoundary]", error);
  }, [error]);

  const isApiError =
    error.message.toLowerCase().includes("failed to fetch") ||
    error.name === "ApiError";

  if (isApiError) {
    return <ServerMaintenance show onRetry={reset} />;
  }

  // Fallback for non-API errors — feel free to customise
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}