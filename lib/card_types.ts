import { cache } from "react";
import type { CardType } from "@/lib/types";
import { ApiError } from "@/lib/errors";
import { getApiHeaders } from "@/lib/api-headers";

export const getCardTypes = cache(async (): Promise<CardType[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/promo-cardtypes`,
    {
      headers: getApiHeaders(),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(
      `Failed to fetch card types: ${res.status} ${res.statusText} — ${body}`,
      res.status,
    );
  }

  return res.json();
});
