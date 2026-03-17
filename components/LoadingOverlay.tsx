// components/LoadingOverlay.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingOverlay() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Navigation completed — hide overlay
    const id = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(id);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target?.href && !target.href.startsWith("#") && !target.target) {
        setLoading(true);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const handleNavStart = () => setLoading(true);
    document.addEventListener("navigation-start", handleNavStart);
    return () =>
      document.removeEventListener("navigation-start", handleNavStart);
  }, []);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/25 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-40 h-40 border-10 border-(--pink) border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
