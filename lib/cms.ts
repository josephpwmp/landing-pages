import type { LandingPage } from "@/types/landing";
import { loadLandingPagesFromCsv } from "@/lib/csvSource";

/**
 * Landing data source: `test-source.csv` (project root or `data/test-source.csv`).
 * Mapped in `lib/csvSource.ts` (Google Ads-style columns → LandingPage).
 *
 * Isolation (SSG): see row-level validation in `validateLandingPage` — bad rows are skipped.
 *
 * Optional: `NEXT_PUBLIC_DEFAULT_PHONE` when the sheet has no phone column.
 *
 * Strapi later: replace `loadLandingPagesFromCsv()` with API fetch + same `LandingPage` mapping.
 */

function getMockPages(): LandingPage[] {
  return loadLandingPagesFromCsv();
}

/** All landing pages — useful for dashboards and getStaticPaths. */
export async function getAllLandingPages(): Promise<LandingPage[]> {
  // Simulate async CMS (Strapi is HTTP). Replace body with fetch().
  await Promise.resolve();
  return getMockPages();
}

/** Single page by slug — used in getStaticProps. */
export async function getLandingPageBySlug(
  slug: string
): Promise<LandingPage | null> {
  await Promise.resolve();
  const pages = getMockPages();
  return pages.find((p) => p.slug === slug) ?? null;
}

/** Every slug for static paths. */
export async function getAllLandingSlugs(): Promise<string[]> {
  const pages = await getAllLandingPages();
  return pages.map((p) => p.slug);
}
