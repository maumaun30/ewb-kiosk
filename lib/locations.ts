import { cache } from "react";
import type { Location } from "@/lib/types";

export const getLocations = cache(async (): Promise<Location[]> => {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/promo-locations`,
    {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch locations");

  return res.json();
});
