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

function usePHTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const phTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
  );

  const hours = phTime.getHours();
  const minutes = phTime.getMinutes();
  const seconds = phTime.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");
  const displayMinutes = minutes.toString().padStart(2, "0");
  const displaySeconds = seconds.toString().padStart(2, "0");

  const timeString = `${displayHours}:${displayMinutes}:${displaySeconds}`;
  const ampmString = ampm;

  const dateString = phTime.toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return { timeString, ampmString, dateString };
}

const IdleOverlay: React.FC<SettingsProps> = ({ settings }) => {
  const [isIdle, setIsIdle] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { timeString, ampmString, dateString } = usePHTime();

  console.log(settings)

  const logoUrl =
    settings?.navigation?.fields?.logo_url?.value ?? "/ew-logo_0.png";

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
        @keyframes clockPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
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
        .clock-colon {
          animation: clockPulse 1s step-start infinite;
          display: inline-block;
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

        {/* PH Time */}
        <div
          className="w-full absolute top-0 py-10 px-10 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, var(--green), transparent)",
          }}
        >
          <div className="flex items-center justify-center gap-3 leading-none">
            <span
              className="font-semibold text-[clamp(6rem,5vw,7.5rem)] text-(--purple) tabular-nums tracking-tight"
              suppressHydrationWarning
            >
              {timeString.split(":").map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="clock-colon">:</span>}
                  {part}
                </span>
              ))}
            </span>
            <span
              className="font-semibold text-[clamp(6rem,5vw,7.5rem)] text-(--purple) opacity-80 tracking-tight uppercase"
              suppressHydrationWarning
            >
              {ampmString}
            </span>
          </div>
          <p
            className="text-[clamp(2.4rem,1vw,3.5rem)] text-(--purple) opacity-80 font-medium tracking-[0.15em] uppercase mt-1"
            suppressHydrationWarning
          >
            {dateString}
          </p>
        </div>

        <div
          className="relative z-10 flex flex-col items-center gap-4 w-full py-20 px-10 text-center"
          style={{
            background: "linear-gradient(to top, var(--green), transparent)",
          }}
        >
          <img
            src={logoUrl}
            height={0}
            width={0}
            alt="EastWest official logo"
            className="w-96 h-auto"
            loading="eager"
          />
          {settings.video_overlay.fields.overlay_content.value && (
            <span className="font-semibold text-[clamp(3.6rem,4vw,4.4rem)] text-(--purple) tracking-[0.06em]">
              {settings.video_overlay.fields.overlay_content.value}
            </span>
          )}
          <p className="idle-shimmer font-medium text-[clamp(2rem,1.6vw,2.35rem)] tracking-[0.3em] uppercase mb-0">
            Touch screen to begin
          </p>
        </div>
      </div>
    </>
  );
};

export default IdleOverlay;
