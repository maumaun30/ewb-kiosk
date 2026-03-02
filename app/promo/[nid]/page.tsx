import { getPromo, getPromos } from "@/lib/promos";
import type { Promo } from "@/lib/types";

import RelatedPromos from "@/components/RelatedPromos";

import Image from "next/image";

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

  const tags = [
    ...(categories?.map((t) => ({
      ...t,
      style: "border-(--purple) bg-[rgba(84,39,133,.2)]",
    })) ?? []),
    ...(card_types?.map((t) => ({
      ...t,
      style: "border-(--pink) bg-[rgba(178,0,110,0.2)]",
    })) ?? []),
    ...(locations?.map((t) => ({
      ...t,
      style: "border-(--green) bg-[rgba(214,224,77,0.2)]",
    })) ?? []),
  ];

  const relatedPromos = getRelatedPromos(promo, allPromos);

  return (
    <>
      <section>
        <div className="max-w-6xl mx-auto py-20 px-5">
          <div className="flex items-center justify-center gap-10">
            <div className="flex-1">
              <h1 className="mb-2">{promo.title}</h1>
              {promo.field_promo_duration && (
                <div className="mb-10">
                  <em className="font-light">{promo.field_promo_duration}</em>
                </div>
              )}

              <div
                dangerouslySetInnerHTML={{ __html: promo.field_excerpt ?? "" }}
              />

              <div className="mt-10 flex flex-wrap gap-2 items-center">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className={`border ${tag.style} px-4 py-1 rounded-full text-black text-[12px] text-nowrap`}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${promo.field_featured_image}`}
                alt={promo.title}
                className="w-full rounded-2xl"
                height={0}
                width={0}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="promo-mechanics">
        <div className="max-w-6xl mx-auto pb-20 px-5">
          <h2 className="mb-5">Promo Mechanics</h2>
          <div dangerouslySetInnerHTML={{ __html: promo.body ?? "" }} />
        </div>
      </section>

      {relatedPromos.length > 0 && (
        <RelatedPromos current={promo} all={allPromos} />
      )}
    </>
  );
}
