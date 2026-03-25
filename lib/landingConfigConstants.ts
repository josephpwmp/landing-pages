/** CSV written by /api/save-landing-config — keep column order in sync with API + parser. */
export const LANDING_CONFIG_HEADER = [
  "slug",
  "template_key",
  "headline",
  "subheadline",
  "brand_name",
  "phone",
  "call_extension",
  "discount_amount",
  "counties_state",
  "main_city",
  "cities_json",
  "review1_name",
  "review1_text",
  "review2_name",
  "review2_text",
  "logo_path",
  "hero_contact_image",
  "section2_image",
  "why_choose_image",
  "ba1",
  "ba2",
  "ba3",
  "ba4",
  "ba5",
  "ba6",
  "whatconverts_script",
  "color_section_bg",
  "color_cta_red",
  "color_cta_green",
  "form_action_url",
  "created_iso",
] as const;

export type TemplateKey =
  | "pressure_washing"
  | "roof_cleaning"
  | "window_cleaning"
  | "gutter_cleaning"
  | "paver_sealing"
  | "christmas_lights";

export const TEMPLATE_OPTIONS: { value: TemplateKey; label: string }[] = [
  { value: "pressure_washing", label: "Template #1: Pressure Washing" },
  { value: "roof_cleaning", label: "Template #1: Roof Cleaning" },
  { value: "window_cleaning", label: "Template #1: Window Cleaning" },
  { value: "gutter_cleaning", label: "Template #1: Gutter Cleaning" },
  { value: "paver_sealing", label: "Template #1: Paver Sealing" },
  { value: "christmas_lights", label: "Template #1: Christmas Lights" },
];

type TemplateMeta = {
  serviceWord: string;
  serviceWordLower: string;
  /** Short label for body copy, e.g. “Window Cleaning”, “Pressure Washing”. */
  localLeadIn: string;
  headline: (mainCity: string, brand: string) => string;
  areaLine: string;
};

export const TEMPLATE_META: Record<TemplateKey, TemplateMeta> = {
  window_cleaning: {
    serviceWord: "Cleaning",
    serviceWordLower: "cleaning",
    localLeadIn: "Window Cleaning",
    headline: (mainCity, brand) =>
      mainCity
        ? `#1 Choice for Local Window Cleaning in ${mainCity}`
        : `#1 Choice for Local Window Cleaning — ${brand}`,
    areaLine: "We Service Your Area",
  },
  pressure_washing: {
    serviceWord: "Washing",
    serviceWordLower: "washing",
    localLeadIn: "Pressure Washing",
    headline: (mainCity, brand) =>
      mainCity
        ? `Professional Pressure Washing in ${mainCity}`
        : `Professional Pressure Washing — ${brand}`,
    areaLine: "We Service Your Area",
  },
  roof_cleaning: {
    serviceWord: "Cleaning",
    serviceWordLower: "cleaning",
    localLeadIn: "Roof Cleaning",
    headline: (mainCity, brand) =>
      mainCity
        ? `Expert Roof Cleaning in ${mainCity}`
        : `Expert Roof Cleaning — ${brand}`,
    areaLine: "We Service Your Area",
  },
  gutter_cleaning: {
    serviceWord: "Cleaning",
    serviceWordLower: "cleaning",
    localLeadIn: "Gutter Cleaning",
    headline: (mainCity, brand) =>
      mainCity
        ? `Gutter Cleaning You Can Trust in ${mainCity}`
        : `Gutter Cleaning — ${brand}`,
    areaLine: "We Service Your Area",
  },
  paver_sealing: {
    serviceWord: "Sealing",
    serviceWordLower: "sealing",
    localLeadIn: "Paver Sealing",
    headline: (mainCity, brand) =>
      mainCity
        ? `Paver Sealing & Restoration in ${mainCity}`
        : `Paver Sealing — ${brand}`,
    areaLine: "We Service Your Area",
  },
  christmas_lights: {
    serviceWord: "Lights",
    serviceWordLower: "lights",
    localLeadIn: "Holiday Lighting",
    headline: (mainCity, brand) =>
      mainCity
        ? `Holiday Lighting in ${mainCity}`
        : `Holiday Lighting — ${brand}`,
    areaLine: "We Service Your Area",
  },
};
