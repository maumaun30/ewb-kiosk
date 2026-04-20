// home
import { Suspense } from "react";
import { SkeletonTracker } from "@/context/SkeletonLoadingContext";

import HomeSliderSection from "@/components/home/HomeSliderSection";
import HomeSliderSkeleton from "@/components/home/HomeSliderSkeleton";
import HomeCategoriesSection from "@/components/home/HomeCategoriesSection";
import HomeCategoriesSkeleton from "@/components/home/HomeCategoriesSkeleton";

export default function Home() {
  return (
    <>
      <Suspense fallback={<SkeletonTracker><HomeSliderSkeleton /></SkeletonTracker>}>
        <HomeSliderSection />
      </Suspense>
      <Suspense fallback={<SkeletonTracker><HomeCategoriesSkeleton /></SkeletonTracker>}>
        <HomeCategoriesSection />
      </Suspense>
    </>
  );
}
