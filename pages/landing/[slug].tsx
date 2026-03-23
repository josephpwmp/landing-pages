import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { LandingPage } from "@/types/landing";
import { LandingTemplate } from "@/components/LandingTemplate";
import {
  getAllLandingSlugs,
  getLandingPageBySlug,
} from "@/lib/cms";
import { getServiceAreaCities } from "@/lib/csvSource";

type PageProps = {
  page: LandingPage;
  serviceAreaCities: string[];
};

/**
 * Dynamic route: /landing/[slug]
 *
 * Next.js SSG: each slug becomes its own static HTML file + route chunk; other slugs are unaffected
 * if this page 404s or omits a path (see lib/cms.ts for validation / no central throw).
 *
 * Caveat: shared React/Next runtime chunks are still common across routes; a bug in *shared*
 * `LandingTemplate` code can affect every landing until fixed — only *data* and *per-route* output
 * are isolated by slug.
 */
export default function LandingPageRoute({
  page,
  serviceAreaCities,
}: PageProps) {
  return (
    <>
      <Head>
        <title>{page.headline}</title>
        <meta name="description" content={page.subheadline} />
      </Head>
      <LandingTemplate page={page} serviceAreaCities={serviceAreaCities} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllLandingSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    // Strapi: set false if new slugs appear often and you use fallback + ISR revalidate
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const slug = ctx.params?.slug;
  const slugStr = Array.isArray(slug) ? slug[0] : slug;

  if (!slugStr) {
    return { notFound: true };
  }

  try {
    const page = await getLandingPageBySlug(slugStr);

    if (!page) {
      return { notFound: true };
    }

    return {
      props: {
        page,
        serviceAreaCities: getServiceAreaCities(),
      },
    };
  } catch (e) {
    // One slug’s CMS failure must not fail the entire `next build`
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(`[landing/${slugStr}] getStaticProps`, e);
    }
    return { notFound: true };
  }
};
