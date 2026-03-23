import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { LandingPage } from "@/types/landing";
import { LandingTemplate } from "@/components/LandingTemplate";
import {
  getAllLandingSlugs,
  getLandingPageBySlug,
} from "@/lib/cms";

type PageProps = {
  page: LandingPage;
};

/**
 * Dynamic route: /landing/[slug]
 *
 * getStaticPaths + getStaticProps pre-render one HTML file per slug from the mock CMS.
 * After switching to Strapi, keep the same pattern: paths from API, props from fetch by slug.
 */
export default function LandingPageRoute({ page }: PageProps) {
  return (
    <>
      <Head>
        <title>{page.headline}</title>
        <meta name="description" content={page.subheadline} />
      </Head>
      <LandingTemplate page={page} />
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

  const page = await getLandingPageBySlug(slugStr);

  if (!page) {
    return { notFound: true };
  }

  return {
    props: { page },
  };
};
