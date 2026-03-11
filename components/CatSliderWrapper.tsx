import type { Category } from "@/lib/types";

import { getCategories } from "@/lib/categories";

import CatSlider from "./CatSlider";

interface Props {
  activeCategoryId?: string;
}

export default async function CatSliderWrapper({ activeCategoryId }: Props) {
  const categories: Category[] = await getCategories();

  return <CatSlider categories={categories} activeCategoryId={activeCategoryId} />;
}