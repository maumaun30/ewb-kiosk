import { cache } from "react";
import type { CardType } from "@/lib/types";

export const getCardTypes = cache(async (): Promise<CardType[]> => {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/promo-cardtypes`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "X-API-Key": `${process.env.DRUPAL_API_KEY}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch card types");

  return res.json();
});
