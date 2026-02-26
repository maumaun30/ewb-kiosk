import { getCategory, getCategories } from "@/lib/categories";
import { getLocations } from "@/lib/locations";
import { getCardTypes } from "@/lib/card_types";
import { getPromos } from "@/lib/promos";

import CatSliderWrapper from "@/components/CatSliderWrapper";
import PromoFilter from "@/components/PromoFilter";

import Image from "next/image";

export default async function Category({
  params,
}: {
  params: Promise<{ tid: string }>;
}) {
  const { tid } = await params;

  const category = await getCategory(tid);
  const categories = await getCategories();
  const locations = await getLocations();
  const card_types = await getCardTypes();
  const promos = await getPromos();

  // Pre-filter promos for this category on the server
  const filteredPromos = promos.filter((promo) =>
    promo.field_categories_reference?.some((cat) => cat.tid === tid),
  );

  return (
    <>
      <section className="aspect-[4] relative mb-25">
        <div className="w-full absolute inset-0 h-full z-1 pointer-events-none">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category.banner}`}
            height={0}
            width={0}
            alt={category.name}
            sizes="100vw"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
        <div className="max-w-5xl mx-auto py-20 px-5 h-full relative z-2">
          {/* CONTENT HERE */}
        </div>
        <div className="max-w-5xl mx-auto px-5 relative z-2 translate-y-15">
          <CatSliderWrapper />
        </div>
      </section>

      <section className="py-20 px-5">
        <PromoFilter
          promos={filteredPromos}
          categories={categories}
          locations={locations}
          card_types={card_types}
        />
      </section>
    </>
  );
}
