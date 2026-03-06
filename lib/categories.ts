import { cache } from "react";
import type { Category } from "@/lib/types";
import { ApiError } from "@/lib/errors";

export const getCategories = cache(async (): Promise<Category[]> => {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/promo-categories`,
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
      `Failed to fetch categories: ${res.status} ${res.statusText} — ${body}`,
      res.status,
    );
  }

  return res.json();
});

export const getCategory = cache(async (tid: string): Promise<Category> => {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/promo-categories/${tid}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "X-API-Key": `${process.env.DRUPAL_API_KEY}`,
      },
      next: { revalidate: 300 },
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(
      `Failed to fetch category: ${res.status} ${res.statusText} — ${body}`,
      res.status,
    );
  }

  const data = await res.json();
  return data[0];
});