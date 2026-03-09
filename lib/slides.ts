import { cache } from "react";
import type { Slide } from "@/lib/types";
import { ApiError } from "@/lib/errors";

export const getSlides = cache(async (): Promise<Slide[]> => {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/slides`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "X-API-Key": `${process.env.DRUPAL_API_KEY}`,
      },
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

  return res.json();
});
