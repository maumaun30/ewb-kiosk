import type { Promo } from "@/lib/types";

export interface PromoTag {
  tid: string;
  name: string;
  /** Tailwind classes for the pill's border/background, colour-coded by taxonomy. */
  style: string;
}

/** Flattens a promo's categories, card types and locations into colour-coded pills. */
export function buildPromoTags(promo: Promo): PromoTag[] {
  return [
    ...(promo.field_categories_reference?.map((t) => ({
      tid: t.tid,
      name: t.name,
      style: "border-(--purple) bg-[rgba(84,39,133,.2)]",
    })) ?? []),
    ...(promo.field_card_type?.map((t) => ({
      tid: t.tid,
      name: t.name,
      style: "border-(--pink) bg-[rgba(178,0,110,0.2)]",
    })) ?? []),
    ...(promo.field_locations?.map((t) => ({
      tid: t.tid,
      name: t.name,
      style: "border-(--green) bg-[rgba(214,224,77,0.2)]",
    })) ?? []),
  ];
}
