import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import type { LandingPage } from "@/types/landing";
import { parseLandingPage } from "@/lib/validateLandingPage";
import {
  LANDING_CONFIG_HEADER,
  TEMPLATE_META,
  type TemplateKey,
} from "@/lib/landingConfigConstants";

const CONFIG_PATH = path.join(process.cwd(), "data", "landing-configs.csv");

function heroFallback(slug: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/700`;
}

function parseCitiesJson(raw: string): string[] {
  if (!raw?.trim()) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === "string" && x.trim() !== "");
  } catch {
    return [];
  }
}

function recordToLandingPage(
  r: Record<string, string>
): LandingPage | null {
  const slug = (r.slug ?? "").trim();
  if (!slug) return null;

  const templateKey = (r.template_key ?? "window_cleaning") as TemplateKey;
  const meta = TEMPLATE_META[templateKey] ?? TEMPLATE_META.window_cleaning;
  const mainCity = (r.main_city ?? "").trim();
  const brand = (r.brand_name ?? "").trim() || "Your Company";
  const discount = (r.discount_amount ?? "").trim() || "75";
  const counties = (r.counties_state ?? "").trim();

  const headlineOverride = (r.headline ?? "").trim();
  const subheadlineOverride = (r.subheadline ?? "").trim();

  const headline =
    headlineOverride ||
    meta.headline(
      mainCity ? titleCase(mainCity) : "",
      brand
    );
  const subheadline =
    subheadlineOverride ||
    `Get $${discount} OFF If You Book Today.\nMention You Saw Our Ad On Google For Discount.`;

  const heroContact = (r.hero_contact_image ?? "").trim();
  const heroImage = heroContact || heroFallback(slug || "page");

  const citiesList = parseCitiesJson(r.cities_json ?? "[]");

  const baPaths = [r.ba1, r.ba2, r.ba3, r.ba4, r.ba5, r.ba6]
    .map((x) => (x ?? "").trim())
    .filter(Boolean);
  const imagesPayload: Record<string, unknown> = {};
  const logo = (r.logo_path ?? "").trim();
  const sec2 = (r.section2_image ?? "").trim();
  const why = (r.why_choose_image ?? "").trim();
  if (logo) imagesPayload.logo = logo;
  if (sec2) imagesPayload.section2 = sec2;
  if (why) imagesPayload.whyChoose = why;
  if (baPaths.length) imagesPayload.beforeAfter = baPaths;

  const colorsPayload: Record<string, unknown> = {};
  const cBg = (r.color_section_bg ?? "").trim();
  const cRed = (r.color_cta_red ?? "").trim();
  const cGr = (r.color_cta_green ?? "").trim();
  if (cBg) colorsPayload.sectionDark = cBg;
  if (cRed) colorsPayload.ctaRed = cRed;
  if (cGr) colorsPayload.ctaGreen = cGr;

  const rawPage: Record<string, unknown> = {
    slug,
    headline,
    subheadline,
    heroImage,
    phone: (r.phone ?? "").trim() || "(000) 000-0000",
    businessName: brand,
    city: mainCity ? titleCase(mainCity) : "Your Area",
    serviceWord: meta.serviceWord,
    serviceWordLower: meta.serviceWordLower,
    formAction: (r.form_action_url ?? "").trim() || "#",
    cta: { label: "Request estimate", href: "#estimate" },
    phoneSecondary: (r.call_extension ?? "").trim() || undefined,
    source: "generator",
    templateKey,
    countiesState: counties || undefined,
    serviceCitiesList: citiesList.length ? citiesList : undefined,
    discountAmount: discount,
    whatconvertsScript: (r.whatconverts_script ?? "").trim() || undefined,
    review1:
      r.review1_name || r.review1_text
        ? {
            name: (r.review1_name ?? "").trim() || "Customer",
            text: (r.review1_text ?? "").trim() || "",
          }
        : undefined,
    review2:
      r.review2_name || r.review2_text
        ? {
            name: (r.review2_name ?? "").trim() || "Customer",
            text: (r.review2_text ?? "").trim() || "",
          }
        : undefined,
    ...(Object.keys(imagesPayload).length ? { images: imagesPayload } : {}),
    ...(Object.keys(colorsPayload).length ? { colors: colorsPayload } : {}),
  };

  return parseLandingPage(rawPage);
}

function titleCase(s: string) {
  return s
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function loadLandingConfigsFromCsv(): LandingPage[] {
  if (!fs.existsSync(CONFIG_PATH)) return [];

  const text = fs.readFileSync(CONFIG_PATH, "utf8");
  if (!text.trim()) return [];

  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  /** Last row wins if the same slug appears more than once. */
  const bySlug = new Map<string, LandingPage>();

  for (const r of records) {
    const page = recordToLandingPage(r);
    if (!page) continue;
    bySlug.set(page.slug, page);
  }

  return Array.from(bySlug.values());
}

export function getLandingConfigCsvPath() {
  return CONFIG_PATH;
}

export { LANDING_CONFIG_HEADER };
