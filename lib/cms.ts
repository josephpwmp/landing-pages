import type { LandingPage } from "@/types/landing";
import mockCms from "@/data/landing-pages.json";

type MockCmsFile = { pages: LandingPage[] };

/**
 * MOCK CMS — replace with Strapi (or another headless CMS) later.
 *
 * Strapi integration sketch:
 * - Create a "Landing Page" collection type with fields: slug (UID), headline, subheadline,
 *   heroImage (Media, single), phone, phoneSecondary (optional), businessName, city,
 *   serviceWord, serviceWordLower, formAction (optional), cta (component: label + href).
 * - Use `fetch(`${process.env.STRAPI_URL}/api/landing-pages?filters[slug][$eq]=${slug}&populate=*`)`
 *   in getStaticProps (or use @strapi/strapi-sdk / graphql).
 * - Map Strapi’s `data.attributes` into our `LandingPage` shape (see types/landing.ts).
 * - For images: build absolute URLs with Strapi’s media URL prefix or use Strapi’s `formats`.
 * - For getStaticPaths: `fetch(`${STRAPI_URL}/api/landing-pages?fields[0]=slug`)` and map slugs.
 *
 * Keep this module as the single place that knows how landing data is loaded.
 */

function getMockPages(): LandingPage[] {
  const data = mockCms as MockCmsFile;
  return data.pages;
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
