import { cache } from "react";
import { ApiError } from "@/lib/errors";
import { getApiHeaders } from "@/lib/api-headers";

/* ---------- API Response ---------- */

export interface Setting {
  status: string;
  endpoint: string;
  data: Data;
}

export interface Data {
  navigation: NavigationSection;
  homepage: HomepageSection;
  video_overlay: VideoOverlaySection;
  footer: FooterSection;
  category_page: CategorySection;
}

interface BaseSection<T> {
  label: string;
  fields: T;
}

/* ---------- Navigation ---------- */

type NavigationSection = BaseSection<NavigationFields>;

interface NavigationFields {
  logo_url: MediaImageField;
}

/* ---------- Homepage ---------- */

type HomepageSection = BaseSection<HomepageFields>;

interface HomepageFields {
  promo_title: TextField;
  promo_content: WysiwygField;
  promo_subtitle: TextField;
}

/* ---------- Video Overlay ---------- */

type VideoOverlaySection = BaseSection<VideoOverlayFields>;

interface VideoOverlayFields {
  enable_clockdate: BooleanField;
  overlay_content: TextField;
  video_type: SelectField;
  video_url: UrlField;
  idle_timeout: NumberField;
  reset_timeout: NumberField;
}

/* ---------- Footer ---------- */

type FooterSection = BaseSection<FooterFields>;

interface FooterFields {
  footer_logo_url: MediaImageField;
}

/* ---------- Footer ---------- */

type CategorySection = BaseSection<CategoryFields>;

interface CategoryFields {
  all_promos_banner: MediaImageField;
  all_promos_icon: MediaImageField;
  all_promos_content: WysiwygField;
}

/* ---------- Field Types ---------- */

interface BaseField<T> {
  label: string;
  type: string;
  value: T;
}

interface MediaImageField extends BaseField<string> {
  type: "media_image";
  url: string;
  media_id: number;
}

interface TextField extends BaseField<string> {
  type: "textfield";
}

interface WysiwygField extends BaseField<string> {
  type: "wysiwyg";
}

interface SelectField extends BaseField<string> {
  type: "select";
}

interface UrlField extends BaseField<string> {
  type: "url";
}

interface NumberField extends BaseField<number> {
  type: "number";
}

interface BooleanField extends BaseField<boolean> {
  type: "boolean";
}

/* ---------- Fetch Settings ---------- */

export const getSettings = cache(async (): Promise<Data> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/settings`,
    {
      headers: getApiHeaders(),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(
      `Failed to fetch settings: ${res.status} ${res.statusText} — ${body}`,
      res.status,
    );
  }

  const json = (await res.json()) as Setting;
  return json.data;
});
