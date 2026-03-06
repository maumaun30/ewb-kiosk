"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const IDLE_TIMEOUT_MS = 30_000;       // 30s → show overlay
const RESET_TIMEOUT_MS = 5 * 60_000; // 5min → redirect to home

export default function IdleOverlay() {
  const [isIdle, setIsIdle] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Clear both timers
  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }, []);

  // Start the idle countdown; once idle, start the reset countdown
  const resetTimer = useCallback(() => {
    clearTimers();
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      // Start reset countdown — overlay stays, but navigate to home
      resetTimerRef.current = setTimeout(() => {
        router.push("/");
      }, RESET_TIMEOUT_MS);
    }, IDLE_TIMEOUT_MS);
  }, [clearTimers, router]);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "touchstart", "keydown", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimers();
    };
  }, [resetTimer, clearTimers]);

  const handleResume = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsIdle(false);
      setIsLeaving(false);
      resetTimer(); // restarts both timers fresh
    }, 600);
  };

  if (!isIdle) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .idle-in  { animation: fadeIn  0.7s cubic-bezier(0.4,0,0.2,1) forwards; }
        .idle-out { animation: fadeOut 0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
        .idle-shimmer {
          background: linear-gradient(90deg, #fff 0%, var(--green) 30%, #fff 50%, var(--green) 70%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3.5s linear infinite;
        }
      `}</style>

      <div
        className={`${isLeaving ? "idle-out" : "idle-in"} fixed inset-0 z-[9999] cursor-pointer select-none overflow-hidden flex items-end justify-center ew-bg-purple`}
        onClick={handleResume}
      >
        {/* Background video */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full"
            src="https://www.youtube.com/embed/DrS6bvvgCmc?autoplay=1&mute=1&loop=1&playlist=DrS6bvvgCmc&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1"
            allow="autoplay; encrypted-media"
            title="Background video"
            frameBorder="0"
          />
        </div>

        {/* Bottom content */}
        <div
          className="relative z-10 flex flex-col items-center gap-4 w-full py-20 px-10 text-center"
          style={{ background: "linear-gradient(to top, var(--purple), transparent)" }}
        >
          <Image
            src="/ew-logo_0.png"
            height={0}
            width={0}
            alt="EastWest official logo"
            className="w-50 h-auto"
            loading="eager"
          />
          <span className="font-semibold text-[clamp(1.6rem,4vw,2.4rem)] text-white tracking-[0.06em]">
            Check out our promos!
          </span>
          <p className="idle-shimmer font-medium text-[clamp(0.7rem,1.6vw,0.85rem)] tracking-[0.3em] uppercase mb-0">
            Touch screen to begin
          </p>
        </div>
      </div>
    </>
  );
}