import { getCategories } from "@/lib/categories";
import { getLocations } from "@/lib/locations";
import { getCardTypes } from "@/lib/card_types";
import { getPromos } from "@/lib/promos";
import { getSettings } from "@/lib/settings";

import CatSliderWrapper from "@/components/CatSliderWrapper";
import PromoFilter from "@/components/PromoFilter";

import Image from "next/image";

export default async function Category() {
  const categories = await getCategories();
  const locations = await getLocations();
  const card_types = await getCardTypes();
  const promos = await getPromos();
  const settings = await getSettings();

  // Pre-filter promos for this category on the server
  const filteredPromos = promos;

  const banner =
    settings?.category_page?.fields?.all_promos_banner.value ?? "/all-promos-bg.webp";

  return (
    <>
      <section className="aspect-16/7 relative mb-25">
        <div className="w-full absolute inset-0 h-full z-1 pointer-events-none">
          <Image
            src={banner}
            height={0}
            width={0}
            alt="All promos banner"
            sizes="100vw"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
        {/* <div className="max-w-6xl mx-auto py-20 px-5 h-full relative z-2">
          CONTENT HERE
        </div> */}
        <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-3">
          <div className="max-w-6xl mx-auto px-5 relative">
            <CatSliderWrapper />
          </div>
        </div>
      </section>

      <section className="pb-20 pt-10 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-10">Dive into our spectacular promo lineup!</h2>
        </div>
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
