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

  return page;
}
