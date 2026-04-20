import { Suspense } from "react";

import PromoDetailSection from "@/components/promo/PromoDetailSection";
import PromoDetailSkeleton from "@/components/promo/PromoDetailSkeleton";
import RelatedPromosSection from "@/components/promo/RelatedPromosSection";
import RelatedPromosSkeleton from "@/components/promo/RelatedPromosSkeleton";

export default async function PromoPage({
  params,
}: {
  params: Promise<{ nid: string }>;
}) {
  const { nid } = await params;

  return (
    <>
      <Suspense fallback={<PromoDetailSkeleton />}>
        <PromoDetailSection nid={nid} />
      </Suspense>
      <Suspense fallback={<RelatedPromosSkeleton />}>
        <RelatedPromosSection nid={nid} />
      </Suspense>
    </>
  );
}
