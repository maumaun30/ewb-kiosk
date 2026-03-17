import { cache } from "react";
import type { Slide } from "@/lib/types";
import { ApiError } from "@/lib/errors";
import { getApiHeaders } from "@/lib/api-headers";

export const getSlides = cache(async (): Promise<Slide[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/slides`,
    {
      headers: getApiHeaders(),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(
      `Failed to fetch slides: ${res.status} ${res.statusText} — ${body}`,
      res.status,
    );
  }

  return res.json() as Promise<Slide[]>;
});
