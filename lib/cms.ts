import type { LandingPage } from "@/types/landing";
import mockCms from "@/data/landing-pages.json";
import { parseLandingPage } from "@/lib/validateLandingPage";

type MockCmsFile = { pages: unknown[] };

/**
 * MOCK CMS — replace with Strapi (or another headless CMS) later.
 *
 * Isolation (SSG):
 * - Each `/landing/[slug]` is emitted as its own static HTML; CDN serves files independently.
 * - JS is code-split per route; shared framework chunks exist, but page data and route chunks are separate.
 * - To avoid *centralized build failure*: validate each record (see parseLandingPage), never throw from
 *   getStaticProps for one slug — return `notFound` or skip invalid rows so 999 good pages still build.
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
  const out: LandingPage[] = [];
  for (const row of data.pages) {
    const parsed = parseLandingPage(row);
    if (parsed) out.push(parsed);
    else if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[cms] skipped invalid landing page row", row);
    }
  }
  return out;
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
