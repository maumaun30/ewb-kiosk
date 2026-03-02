"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (pathname === "/") return null;

  const handleClick = () => {
    setLoading(true);
    router.back();
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Go back"
      disabled={loading}
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center rounded-full ew-bg-pink p-4 backdrop-blur-sm"
    >
      {loading ? (
        <svg
          className="animate-spin"
          width={40}
          height={40}
          viewBox="0 0 40 40"
          fill="none"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="white"
            strokeOpacity="0.3"
            strokeWidth="4"
          />
          <path
            d="M20 4a16 16 0 0 1 16 16"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <ArrowLeft color="white" size={40} strokeWidth={2.5} />
      )}
    </button>
  );
}