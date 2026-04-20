// home
import { Suspense } from "react";

import HomeSliderSection from "@/components/home/HomeSliderSection";
import HomeSliderSkeleton from "@/components/home/HomeSliderSkeleton";
import HomeCategoriesSection from "@/components/home/HomeCategoriesSection";
import HomeCategoriesSkeleton from "@/components/home/HomeCategoriesSkeleton";

export default function Home() {
  return (
    <>
      <Suspense fallback={<HomeSliderSkeleton />}>
        <HomeSliderSection />
      </Suspense>
      <Suspense fallback={<HomeCategoriesSkeleton />}>
        <HomeCategoriesSection />
      </Suspense>
    </>
  );
}
