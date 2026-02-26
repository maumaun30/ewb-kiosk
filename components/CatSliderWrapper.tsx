import type { Category } from "@/lib/types";

import { getCategories } from "@/lib/categories";

import CatSlider from "./CatSlider";

export default async function CatSliderWrapper() {
  const categories: Category[] = await getCategories();

  return <CatSlider categories={categories} />;
}
