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
  // Whether the destination page has rendered any skeletons since navigation started
  const [hadSkeletons, setHadSkeletons] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [prevSkeletonCount, setPrevSkeletonCount] = useState(skeletonCount);
  const hadSkeletonsRef = useRef(false);
  const isFirstRender = useRef(true);

  // Adjust state while rendering when inputs change, instead of in effects
  // (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setHadSkeletons(false);
  }
  if (skeletonCount !== prevSkeletonCount) {
    setPrevSkeletonCount(skeletonCount);
    if (navLoading) {
      if (skeletonCount > 0) {
        setHadSkeletons(true);
      } else if (hadSkeletons) {
        // All skeletons on the new page resolved: navigation is done
        setHadSkeletons(false);
        setNavLoading(false);
      }
    }
  }

  // Timer callbacks read the latest value through a ref
  useEffect(() => {
    hadSkeletonsRef.current = hadSkeletons;
  }, [hadSkeletons]);

  // After a route change: clear quickly if no skeletons appear, with a hard safety fallback
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const shortTimer = setTimeout(() => {
      if (!hadSkeletonsRef.current) {
        setNavLoading(false);
      }
    }, 300);
    const safetyTimer = setTimeout(() => setNavLoading(false), 5000);
    return () => {
      clearTimeout(shortTimer);
      clearTimeout(safetyTimer);
    };
  }, [pathname]);

  // Detect any link navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target?.href || target.href.startsWith("#") || target.target) {
        return;
      }
      const targetPath = new URL(target.href, window.location.href).pathname;
      if (targetPath === window.location.pathname) {
        return;
      }
      setNavLoading(true);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (pathname === "/") {
    return null;
  }

  const handleClick = () => {
    const previousPath = goBack() ?? "/";
    if (previousPath === pathname) {
      return;
    }
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
