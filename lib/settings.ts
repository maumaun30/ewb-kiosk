import { cache } from "react";
import { ApiError } from "@/lib/errors";

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
}

interface BaseSection<T> {
  label: string;
  fields: T;
}

/* ---------- Navigation ---------- */

interface NavigationSection extends BaseSection<NavigationFields> {}

interface NavigationFields {
  logo_url: MediaImageField;
}

/* ---------- Homepage ---------- */

interface HomepageSection extends BaseSection<HomepageFields> {}

interface HomepageFields {
  promo_title: TextField;
  promo_content: WysiwygField;
}

/* ---------- Video Overlay ---------- */

interface VideoOverlaySection extends BaseSection<VideoOverlayFields> {}

interface VideoOverlayFields {
  enable_clockdate: BooleanField;
  overlay_content: TextField;
  video_type: SelectField;
  video_url: UrlField;
  idle_timeout: NumberField;
  reset_timeout: NumberField;
}

/* ---------- Footer ---------- */

interface FooterSection extends BaseSection<FooterFields> {}

interface FooterFields {
  footer_logo_url: MediaImageField;
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
  const auth = Buffer.from(
    `${process.env.API_BASIC_USER}:${process.env.API_BASIC_PASS}`,
  ).toString("base64");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kiosk/settings`,
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
      `Failed to fetch settings: ${res.status} ${res.statusText} — ${body}`,
      res.status,
    );
  }

  const json: Setting = await res.json();

  return json.data;
});
