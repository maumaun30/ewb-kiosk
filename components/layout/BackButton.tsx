"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigation } from "@/context/NavigationContext";
import { useSkeletonLoading } from "@/context/SkeletonLoadingContext";

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { goBack } = useNavigation();
  const { count: skeletonCount } = useSkeletonLoading();

  const [navLoading, setNavLoading] = useState(false);
  const isFirstRender = useRef(true);
  const hadSkeletons = useRef(false);
  const shortTimer = useRef<ReturnType<typeof setTimeout>>();
  const safetyTimer = useRef<ReturnType<typeof setTimeout>>();

  // When pathname changes: reset skeleton tracking and start timers
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    hadSkeletons.current = false;
    clearTimeout(shortTimer.current);
    clearTimeout(safetyTimer.current);

    // Pages with no skeletons: clear after 300ms
    shortTimer.current = setTimeout(() => {
      if (!hadSkeletons.current) setNavLoading(false);
    }, 300);

    // Hard safety fallback
    safetyTimer.current = setTimeout(() => setNavLoading(false), 5000);
  }, [pathname]);

  // Keep spinner alive until all skeletons resolve
  useEffect(() => {
    if (!navLoading) return;
    if (skeletonCount > 0) {
      hadSkeletons.current = true;
      clearTimeout(shortTimer.current);
    } else if (hadSkeletons.current) {
      hadSkeletons.current = false;
      clearTimeout(safetyTimer.current);
      setNavLoading(false);
    }
  }, [skeletonCount, navLoading]);

  // Detect any link navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target?.href || target.href.startsWith("#") || target.target) return;
      const targetPath = new URL(target.href, window.location.href).pathname;
      if (targetPath === window.location.pathname) return;
      setNavLoading(true);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (pathname === "/") return null;

  const handleClick = () => {
    const previousPath = goBack() ?? "/";
    if (previousPath === pathname) return;
    setNavLoading(true);
    router.push(previousPath);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Go back"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center rounded-full ew-bg-pink p-4 backdrop-blur-sm"
    >
      {navLoading
        ? <Loader2 color="white" size={40} strokeWidth={2.5} className="animate-spin" />
        : <ArrowLeft color="white" size={40} strokeWidth={2.5} />
      }
    </button>
  );
}
