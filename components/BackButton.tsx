"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useNavigation } from "@/context/NavigationContext";

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { getPreviousPath } = useNavigation();

  if (pathname === "/") return null;

  const handleClick = () => {
    const previousPath = getPreviousPath();
    document.dispatchEvent(new CustomEvent("navigation-start"));
    if (previousPath) {
      router.push(previousPath);
    } else {
      router.push("/"); // fallback
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Go back"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center rounded-full ew-bg-pink p-4 backdrop-blur-sm"
    >
      <ArrowLeft color="white" size={40} strokeWidth={2.5} />
    </button>
  );
}