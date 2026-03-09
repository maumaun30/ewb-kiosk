"use client";

import type { Data } from "@/lib/settings";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SettingsProps {
  settings: Data;
}

function toYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/shorts/")[1];
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/embed/")[1];
      } else {
        videoId = parsed.searchParams.get("v");
      }
    }

    if (!videoId) return null;
    videoId = videoId.split("?")[0].split("&")[0].split("/")[0];

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

const IdleOverlay: React.FC<SettingsProps> = ({ settings }) => {
  const [isIdle, setIsIdle] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const idleTimeout =
    (settings?.video_overlay?.fields?.idle_timeout?.value ?? 30) * 1000;
  const resetTimeout =
    (settings?.video_overlay?.fields?.reset_timeout?.value ?? 300) * 1000;
  const videoType = settings?.video_overlay?.fields?.video_type?.value as
    | "youtube"
    | "external"
    | undefined;
  const videoEmbed = settings?.video_overlay?.fields?.video_url?.value as
    | string
    | undefined;

  const resolvedEmbedUrl =
    videoType === "youtube" && videoEmbed
      ? toYouTubeEmbedUrl(videoEmbed)
      : videoEmbed;

  const hasVideo = !!videoType && !!resolvedEmbedUrl;

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    clearTimers();
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      resetTimerRef.current = setTimeout(() => {
        router.push("/");
      }, resetTimeout);
    }, idleTimeout);
  }, [clearTimers, router, idleTimeout, resetTimeout]);

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "touchstart",
      "keydown",
      "scroll",
    ];
    events.forEach((e) =>
      window.addEventListener(e, resetTimer, { passive: true }),
    );
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
      resetTimer();
    }, 600);
  };

  if (!isIdle) return null;

  const videoId = resolvedEmbedUrl?.split("/embed/")[1];

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
          background: linear-gradient(90deg, var(--purple) 0%, var(--pink) 30%, var(--purple) 50%, var(--pink) 70%, var(--purple) 100%);
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
        {hasVideo && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {videoType === "youtube" ? (
              <iframe
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full"
                src={`${resolvedEmbedUrl}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                allow="autoplay; encrypted-media"
                title="Background video"
                frameBorder="0"
              />
            ) : (
              <video
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full object-cover"
                src={resolvedEmbedUrl}
                autoPlay
                muted
                loop
                playsInline
              />
            )}
          </div>
        )}

        <div
          className="relative z-10 flex flex-col items-center gap-4 w-full py-20 px-10 text-center"
          style={{
            background: "linear-gradient(to top, var(--green), transparent)",
          }}
        >
          <Image
            src="/ew-logo_0.png"
            height={0}
            width={0}
            alt="EastWest official logo"
            className="w-150 h-auto"
            loading="eager"
          />
          <span className="font-semibold text-[clamp(2.6rem,4vw,3.4rem)] text-(--purple) tracking-[0.06em]">
            Check out our promos!
          </span>
          <p className="idle-shimmer font-medium text-[clamp(1.7rem,1.6vw,1.85rem)] tracking-[0.3em] uppercase mb-0">
            Touch screen to begin
          </p>
        </div>
      </div>
    </>
  );
};

export default IdleOverlay;