import { cache } from "react";
import type { Location } from "@/lib/types";
import { ApiError } from "@/lib/errors";
import { getApiHeaders } from "@/lib/api-headers";

export const getLocations = cache(async (): Promise<Location[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/promo-locations`,
    {
      headers: getApiHeaders(),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(
      `Failed to fetch locations: ${res.status} ${res.statusText} — ${body}`,
      res.status,
    );
  }

  return res.json() as Promise<Location[]>;
});
