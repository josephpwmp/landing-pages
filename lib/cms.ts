import type { LandingPage } from "@/types/landing";
import { loadAllLandingPagesMerged } from "@/lib/mergeLandingSources";

/**
 * Landing data: `data/landing-configs.csv` (`lib/landingConfigsCsv.ts`).
 * Legacy Google Ads rows live in the same file (migrated from `test-source.csv`).
 */

function getMockPages(): LandingPage[] {
  return loadAllLandingPagesMerged();
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
