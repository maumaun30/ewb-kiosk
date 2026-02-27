import { cache } from "react";
import type { Promo } from "@/lib/types";

export const getPromos = cache(async (): Promise<Promo[]> => {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/promos`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "X-API-Key": `${process.env.DRUPAL_API_KEY}`,
      },
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch promos");

  return res.json();
});

export const getPromo = cache(async (nid: string): Promise<Promo> => {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/promos/${nid}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "X-API-Key": `${process.env.DRUPAL_API_KEY}`,
      },
      next: { revalidate: 300 },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch promo");

  const data = await res.json();
  return data[0];
});
