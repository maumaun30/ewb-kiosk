import { getCategories } from "@/lib/categories";
import { getLocations } from "@/lib/locations";
import { getCardTypes } from "@/lib/card_types";
import { getPromos } from "@/lib/promos";

import PromoFilter from "../promo/PromoFilter";

interface Props {
  initialCategory?: string;
}

export default async function CategoryPromoSection({ initialCategory }: Props) {
  const [categories, locations, card_types, promos] = await Promise.all([
    getCategories(),
    getLocations(),
    getCardTypes(),
    getPromos(),
  ]);

  return (
    <section className="pb-20 pt-10 px-5">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-10">Dive into our spectacular promo lineup!</h2>
      </div>
      <PromoFilter
        promos={promos}
        categories={categories}
        locations={locations}
        card_types={card_types}
        initialCategory={initialCategory}
      />
    </section>
  );
}
