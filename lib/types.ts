// lib/types.ts
export interface Category {
  tid: string;
  icon?: string;
  banner?: string;
  name: string;
}

export interface Location {
  tid: string;
  name: string;
}

export interface CardType {
  tid: string;
  name: string;
}

export interface Promo {
  nid: string;
  title: string;
  authored_on: string;
  field_promo_duration?: string;
  field_excerpt?: string;
  body?: string;
  field_featured_image?: string;
  field_categories_reference?: Category[];
  field_locations?: Location[];
  field_card_type?: CardType[];
}

export interface Slide {
  body: string;
  background_image?: string;
}
