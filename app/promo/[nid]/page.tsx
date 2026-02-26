import { getPromo, getPromos } from "@/lib/promos";
import type { Promo } from "@/lib/types";

import RelatedPromos from "@/components/RelatedPromos";

import Link from "next/link";

function getRelatedPromos(current: Promo, all: Promo[]): Promo[] {
  const categoryTids = new Set(
    current.field_categories_reference?.map((c) => c.tid) ?? [],
  );
  const locationTids = new Set(
    current.field_locations?.map((l) => l.tid) ?? [],
  );
  const cardTypeTids = new Set(
    current.field_card_type?.map((ct) => ct.tid) ?? [],
  );

  return all.filter((promo) => {
    if (promo.nid === current.nid) return false;

    const matchesCategory = promo.field_categories_reference?.some((c) =>
      categoryTids.has(c.tid),
    );
    const matchesLocation = promo.field_locations?.some((l) =>
      locationTids.has(l.tid),
    );
    const matchesCardType = promo.field_card_type?.some((ct) =>
      cardTypeTids.has(ct.tid),
    );

    return matchesCategory || matchesLocation || matchesCardType;
  });
}

export default async function PromoPage({
  params,
}: {
  params: Promise<{ nid: string }>;
}) {
  const { nid } = await params;

  const [promo, allPromos] = await Promise.all([getPromo(nid), getPromos()]);

  const categories = promo.field_categories_reference;
  const locations = promo.field_locations;
  const card_types = promo.field_card_type;

  const relatedPromos = getRelatedPromos(promo, allPromos);

  return (
    <>
      <section>
        <div className="max-w-5xl mx-auto py-20 px-5">
          <div className="flex items-center justify-center gap-10">
            <div className="flex-1">
              <h1>{promo.title}</h1>
              <div
                dangerouslySetInnerHTML={{ __html: promo.field_excerpt ?? "" }}
              />

              <div className="mt-10 flex gap-2 items-center">
                {categories?.map((category, index) => (
                  <div
                    key={index}
                    className="border border-(--purple) bg-[rgba(84,39,133,.2)] px-4 py-1 rounded-full ew-text-purple text-[10px]"
                  >
                    {category.name}
                  </div>
                ))}
                {card_types?.map((card, index) => (
                  <div
                    key={index}
                    className="border border-(--purple) bg-[rgba(84,39,133,.2)] px-4 py-1 rounded-full ew-text-purple text-[10px]"
                  >
                    {card.name}
                  </div>
                ))}
                {locations?.map((location, index) => (
                  <div
                    key={index}
                    className="border border-(--purple) bg-[rgba(84,39,133,.2)] px-4 py-1 rounded-full ew-text-purple text-[10px]"
                  >
                    {location.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${promo.field_featured_image}`}
                alt={promo.title}
                className="w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-5xl mx-auto py-20 px-5">
          <div dangerouslySetInnerHTML={{ __html: promo.body ?? "" }} />
        </div>
      </section>

      {relatedPromos.length > 0 && (
        <RelatedPromos current={promo} all={allPromos} />
      )}
    </>
  );
}
