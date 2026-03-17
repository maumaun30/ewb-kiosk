import { cache } from "react";
import type { Promo } from "@/lib/types";
import { ApiError } from "@/lib/errors";
import { getApiHeaders } from "@/lib/api-headers";

export const getPromos = cache(async (): Promise<Promo[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/promos`,
    {
      headers: getApiHeaders(),
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(
      `Failed to fetch promos: ${res.status} ${res.statusText} — ${body}`,
      res.status,
    );
  }

  return res.json() as Promise<Promo[]>;
});

export const getPromo = cache(async (nid: string): Promise<Promo> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/promos/${nid}`,
    {
      headers: getApiHeaders(),
      next: { revalidate: 300 },
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(
      `Failed to fetch promo: ${res.status} ${res.statusText} — ${body}`,
      res.status,
    );
  }

  const data = await res.json() as Promise<Promo[]>;

  return data[0] as Promise<Promo[]>;
});
