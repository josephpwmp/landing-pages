import type { LandingPage } from "@/types/landing";

const required: (keyof LandingPage)[] = [
  "slug",
  "headline",
  "subheadline",
  "heroImage",
  "cta",
  "phone",
  "businessName",
  "city",
  "serviceWord",
  "serviceWordLower",
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Runtime validation so one bad CMS/JSON row does not break the whole static build.
 * Invalid docs are skipped (see lib/cms.ts).
 */
export function parseLandingPage(raw: unknown): LandingPage | null {
  if (!isRecord(raw)) return null;

  for (const key of required) {
    if (key === "cta") {
      const cta = raw.cta;
      if (!isRecord(cta)) return null;
      if (typeof cta.label !== "string" || typeof cta.href !== "string") return null;
      continue;
    }
    const val = raw[key];
    if (typeof val !== "string" || val.trim() === "") return null;
  }

  const cta = raw.cta as Record<string, unknown>;
  const page: LandingPage = {
    slug: String(raw.slug).trim(),
    headline: String(raw.headline),
    subheadline: String(raw.subheadline),
    heroImage: String(raw.heroImage),
    cta: { label: String(cta.label), href: String(cta.href) },
    phone: String(raw.phone),
    businessName: String(raw.businessName),
    city: String(raw.city),
    serviceWord: String(raw.serviceWord),
    serviceWordLower: String(raw.serviceWordLower),
  };

  if (typeof raw.phoneSecondary === "string" && raw.phoneSecondary.trim() !== "") {
    page.phoneSecondary = raw.phoneSecondary;
  }
  if (typeof raw.formAction === "string") {
    page.formAction = raw.formAction;
  }

  if (raw.source === "generator" || raw.source === "ads_export") {
    page.source = raw.source;
  }
  if (typeof raw.templateKey === "string" && raw.templateKey.trim()) {
    page.templateKey = raw.templateKey.trim();
  }
  if (typeof raw.countiesState === "string" && raw.countiesState.trim()) {
    page.countiesState = raw.countiesState.trim();
  }
  if (Array.isArray(raw.serviceCitiesList)) {
    const list = raw.serviceCitiesList.filter(
      (x): x is string => typeof x === "string" && x.trim() !== ""
    );
    if (list.length) page.serviceCitiesList = list;
  }
  if (typeof raw.discountAmount === "string" && raw.discountAmount.trim()) {
    page.discountAmount = raw.discountAmount.trim();
  }
  if (typeof raw.whatconvertsScript === "string" && raw.whatconvertsScript.trim()) {
    page.whatconvertsScript = raw.whatconvertsScript.trim();
  }
  if (isRecord(raw.review1)) {
    const n = raw.review1.name;
    const t = raw.review1.text;
    if (typeof n === "string" && typeof t === "string") {
      page.review1 = { name: n, text: t };
    }
  }
  if (isRecord(raw.review2)) {
    const n = raw.review2.name;
    const t = raw.review2.text;
    if (typeof n === "string" && typeof t === "string") {
      page.review2 = { name: n, text: t };
    }
  }
  if (isRecord(raw.images)) {
    const im = raw.images;
    const beforeAfter = Array.isArray(im.beforeAfter)
      ? im.beforeAfter.filter((x): x is string => typeof x === "string")
      : undefined;
    const logo = typeof im.logo === "string" && im.logo.trim() ? im.logo.trim() : undefined;
    const section2 =
      typeof im.section2 === "string" && im.section2.trim() ? im.section2.trim() : undefined;
    const whyChoose =
      typeof im.whyChoose === "string" && im.whyChoose.trim() ? im.whyChoose.trim() : undefined;
    const ba = beforeAfter?.length ? beforeAfter : undefined;
    if (logo || section2 || whyChoose || ba?.length) {
      page.images = {
        logo,
        section2,
        whyChoose,
        beforeAfter: ba,
      };
    }
  }
  if (isRecord(raw.colors)) {
    const c = raw.colors;
    const sectionDark =
      typeof c.sectionDark === "string" && c.sectionDark.trim()
        ? c.sectionDark.trim()
        : undefined;
    const ctaRed =
      typeof c.ctaRed === "string" && c.ctaRed.trim() ? c.ctaRed.trim() : undefined;
    const ctaGreen =
      typeof c.ctaGreen === "string" && c.ctaGreen.trim() ? c.ctaGreen.trim() : undefined;
    if (sectionDark || ctaRed || ctaGreen) {
      page.colors = { sectionDark, ctaRed, ctaGreen };
    }
  }

  return page;
}
