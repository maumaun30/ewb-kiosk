"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { GlobeX, RefreshCw } from "lucide-react";

interface ServerMaintenanceProps {
  show?: boolean;
  message?: string;
  onRetry?: () => Promise<void> | void;
  /** Seconds between auto-reconnect attempts. Default: 30 */
  retryInterval?: number;
}

export default function ServerMaintenance({
  show = true,
  message = "We're performing scheduled maintenance. Our team is working hard to get everything back online.",
  onRetry,
  retryInterval = 30,
}: ServerMaintenanceProps) {
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [countdown, setCountdown] = useState(retryInterval);
  const countdownRef = useRef(retryInterval);

  const handleRetry = useCallback(async () => {
    if (isRetrying || !onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
      countdownRef.current = retryInterval;
      setCountdown(retryInterval);
    }
  }, [isRetrying, onRetry, retryInterval]);

  // Dot loader tick
  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick((t) => (t + 1) % 4), 500);
    return () => clearInterval(id);
  }, []);

  // Auto-reconnect countdown
  useEffect(() => {
    if (!show || !onRetry) return;

    const id = setInterval(() => {
      countdownRef.current -= 1;
      setCountdown(countdownRef.current);

      if (countdownRef.current <= 0) {
        countdownRef.current = retryInterval;
        setCountdown(retryInterval);
        handleRetry();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [show, onRetry, retryInterval, handleRetry]);

  if (!show || !mounted) return null;

  // Arc progress for countdown ring (0 → full circle)
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (retryInterval - countdown) / retryInterval;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Server Maintenance"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-(--pink)/90 backdrop-blur-xl" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(var(--green) 1px, transparent 1px),
            linear-gradient(90deg, var(--green) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "gridScroll 14s linear infinite",
        }}
      />

      {/* Card */}
      <div className="relative w-[90%] rounded-3xl max-w-[480px] border border-amber-500/20 bg-(--purple) px-10 py-14 text-center shadow-[0_0_80px_rgba(255,140,30,0.07),0_32px_64px_rgba(0,0,0,0.6)]">
        <GlobeX color="var(--green)" size={64} className="mx-auto mb-10" />

        {/* Eyebrow */}
        <p className="mb-3 text-[12px] uppercase tracking-[4px] text-(--green)">
          System Status
        </p>

        {/* Title */}
        <h2 className="mb-5 text-2xl font-semibold tracking-tight text-stone-100">
          Server Maintenance
        </h2>

        {/* Divider */}
        <div className="mx-auto mb-6 h-px w-10 bg-(--green)" />

        {/* Body */}
        <p className="mb-9 text-sm leading-relaxed text-white">{message}</p>

        {/* Dot loader */}
        {/* <div className="flex items-center justify-center gap-2" aria-live="polite">
          <span className="flex gap-[5px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-[5px] w-[5px] rounded-full transition-colors duration-200"
                style={{
                  background: tick > i ? "var(--green)" : "rgba(213, 224, 77, 0.2)",
                }}
              />
            ))}
          </span>
          <span className="text-[12px] uppercase tracking-[2px] text-(--green)">
            Reconnecting
          </span>
        </div> */}

        {/* Auto-reconnect countdown + Retry button */}
        {onRetry && (
          <div className="mt-7 flex flex-col items-center gap-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              aria-label={isRetrying ? "Reconnecting…" : "Try Again"}
              className="ew-bg-pink inline-flex items-center gap-2 rounded-4xl px-15 py-3 text-white transition-opacity disabled:opacity-70"
            >
              {isRetrying ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Reconnecting…</span>
                </>
              ) : (
                <span>Try Again</span>
              )}
            </button>

            {/* Countdown ring + label */}
            {!isRetrying && (
              <div className="flex items-center gap-2 text-[11px] text-(--green)/60">
                {/* SVG countdown ring */}
                <svg width="26" height="26" viewBox="0 0 26 26" className="-rotate-90">
                  {/* Track */}
                  <circle
                    cx="13" cy="13" r={radius}
                    fill="none"
                    stroke="rgba(213,224,77,0.15)"
                    strokeWidth="2"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="13" cy="13" r={radius}
                    fill="none"
                    stroke="var(--green)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: "stroke-dashoffset 0.9s linear" }}
                  />
                  {/* Countdown number — rotated back upright */}
                  <text
                    x="13" y="13"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fontSize="8"
                    fill="var(--green)"
                    style={{ transform: "rotate(90deg)", transformOrigin: "13px 13px" }}
                  >
                    {countdown}
                  </text>
                </svg>
                <span>Auto-retry in {countdown}s</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes gridScroll {
          to { background-position: 60px 60px; }
        }
      `}</style>
    </div>
  );
}