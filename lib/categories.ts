import { cache } from "react";
import type { Category } from "@/lib/types";

export const getCategories = cache(async (): Promise<Category[]> => {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/promo-categories`,
    {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch categories");

  return res.json();
});

export const getCategory = cache(async (tid: string): Promise<Category> => {
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/promo-categories/${tid}`,
    {
      headers: { Authorization: `Basic ${auth}` },
      next: { revalidate: 300 },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch category");

  const data = await res.json();
  return data[0];
});