import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import type { LandingPage } from "@/types/landing";
import { getAllLandingPages } from "@/lib/cms";

type Props = {
  pages: LandingPage[];
};

/**
 * Bonus: lists every slug from the same mock CMS used by /landing/[slug].
 * Uses getStaticProps so the list is generated at build time (refresh after CMS changes).
 */
export default function Dashboard({ pages }: Props) {
  return (
    <>
      <Head>
        <title>Landing pages — dashboard</title>
      </Head>
      <main className="dashboard">
        <h1>Landing pages</h1>
        <p className="dashboard__lead">
          Statically generated routes from mock CMS data (
          <code>data/landing-pages.json</code>). Replace the loader in{" "}
          <code>lib/cms.ts</code> when you connect Strapi.
        </p>
        <ul className="slug-list">
          {pages.map((p) => (
            <li key={p.slug}>
              <Link href={`/landing/${p.slug}`}>
                <div className="slug-list__title">{p.headline}</div>
                <div className="slug-list__path">/landing/{p.slug}</div>
              </Link>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: "2rem" }}>
          <Link href="/" style={{ color: "#2563eb" }}>
            ← Home
          </Link>
        </p>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pages = await getAllLandingPages();
  return {
    props: { pages },
  };
};
