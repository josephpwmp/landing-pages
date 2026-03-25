import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import type { LandingPage } from "@/types/landing";
import { parseLandingPage } from "@/lib/validateLandingPage";

/**
 * Google Ads export layout (test-source.csv):
 * Cols 0–2: Campaign, Cities, Ad Group
 * Headlines 1–15: text at 3 + (n-1)*2, score at following column
 * Descriptions 1–4: start index 33 + (n-1)*2
 * Final URL: 41, Path1: 42, Path2: 44
 */
const COL = {
  CITIES: 1,
  H1: 3,
  H2: 5,
  H11: 23,
  H15: 31,
  D1: 33,
  FINAL_URL: 41,
  PATH2: 44,
} as const;

const MIN_COLS = 45;

export function resolveAdsCsvPath(): string | null {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "test-source.csv"),
    path.join(cwd, "data", "test-source.csv"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function slugify(input: string): string {
  const s = input.trim().toLowerCase();
  const slug = s
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "page";
}

function titleCaseCity(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function extractDkiSlug(finalUrl: string): string | null {
  try {
    const u = finalUrl.includes("://") ? new URL(finalUrl) : null;
    if (!u) return null;
    const dki = u.searchParams.get("dki");
    if (!dki) return null;
    return slugify(dki.replace(/\+/g, " "));
  } catch {
    return null;
  }
}

export function defaultPhoneForAdsExport(): string {
  return (
    process.env.NEXT_PUBLIC_DEFAULT_PHONE?.trim() || "(407) 734-9076"
  );
}

function heroImageForSlug(slug: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/1200/700`;
}

/** Parsed row from a Google Ads export line (used for migration + landing page mapping). */
export type AdsCsvRowParsed = {
  slug: string;
  cityDisplay: string;
  headline: string;
  subheadline: string;
  businessName: string;
  finalUrl: string;
};

export function parseAdsExportRow(row: string[]): AdsCsvRowParsed | null {
  if (row.length < MIN_COLS) return null;

  const cityRaw = (row[COL.CITIES] ?? "").trim();
  const cityDisplay = cityRaw ? titleCaseCity(cityRaw) : "";

  let slug = cityRaw
    ? slugify(cityRaw)
    : extractDkiSlug(row[COL.FINAL_URL] ?? "") || "default";
  if (slug === "page") slug = "default";

  const h1 = (row[COL.H1] ?? "").trim();
  const h2 = (row[COL.H2] ?? "").trim();
  const h11 = (row[COL.H11] ?? "").trim();
  const h15 = (row[COL.H15] ?? "").trim();
  const d1 = (row[COL.D1] ?? "").trim();

  let headline: string;
  if (cityDisplay) {
    headline =
      h11 && h11.length > 0
        ? h11
        : `${h1 || "Local Window Cleaning Services"} in ${cityDisplay}`;
  } else {
    headline = h1 || h11 || "Local Window Cleaning Services";
  }

  const subParts = [h2, d1].filter((p) => p.length > 0);
  const subheadline =
    subParts.join("\n\n") || h2 || d1 || "Book your free estimate today.";

  const businessName =
    h15 && h15.length > 0 ? h15 : "Tropical Window Cleaning";

  const finalUrl = (row[COL.FINAL_URL] ?? "").trim() || "#";

  return {
    slug,
    cityDisplay,
    headline,
    subheadline,
    businessName,
    finalUrl,
  };
}

/**
 * Maps one CSV row to a LandingPage-shaped object, then validates.
 * @deprecated Prefer `data/landing-configs.csv` — kept for `migrate:csv` tooling.
 */
export function rowToLandingPage(row: string[]): LandingPage | null {
  const p = parseAdsExportRow(row);
  if (!p) return null;

  const raw: Record<string, unknown> = {
    slug: p.slug,
    headline: p.headline,
    subheadline: p.subheadline,
    heroImage: heroImageForSlug(p.slug),
    phone: defaultPhoneForAdsExport(),
    businessName: p.businessName,
    city: p.cityDisplay || "Your Area",
    serviceWord: "Cleaning",
    serviceWordLower: "cleaning",
    formAction: p.finalUrl,
    cta: { label: "Request estimate", href: "#estimate" },
  };

  return parseLandingPage(raw);
}

export function loadLandingPagesFromCsv(): LandingPage[] {
  const csvPath = resolveAdsCsvPath();
  if (!csvPath) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[csv] test-source.csv not found (cwd or data/test-source.csv)");
    }
    return [];
  }

  const rawFile = fs.readFileSync(csvPath, "utf8");
  const rows = parse(rawFile, {
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  }) as string[][];

  const dataRows = rows.slice(1);
  const out: LandingPage[] = [];
  const seen = new Set<string>();

  for (const row of dataRows) {
    const page = rowToLandingPage(row);
    if (!page) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("[csv] skipped row (too few columns or invalid)", row[0]?.slice(0, 40));
      }
      continue;
    }
    let slug = page.slug;
    if (seen.has(slug)) {
      let n = 2;
      while (seen.has(`${page.slug}-${n}`)) n += 1;
      slug = `${page.slug}-${n}`;
    }
    seen.add(slug);
    out.push(slug === page.slug ? page : { ...page, slug });
  }

  return out;
}

/** @deprecated Use `getMergedServiceAreaCities` from `mergeLandingSources` */
export function getServiceAreaCities(): string[] {
  const pages = loadLandingPagesFromCsv();
  const names = new Set<string>();
  for (const p of pages) {
    const c = p.city?.trim();
    if (c && c !== "Your Area") names.add(c);
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}
