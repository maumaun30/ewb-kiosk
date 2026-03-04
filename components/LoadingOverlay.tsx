// components/LoadingOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingOverlay() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(false); // Hide overlay when navigation completes
  }, [pathname, searchParams]);

  // Expose a way to trigger loading from anywhere
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

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/25 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="w-40 h-40 border-10 border-(--pink) border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
