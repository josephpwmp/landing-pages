import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps } from "next";
import type { LandingPage } from "@/types/landing";
import { getAllLandingPages } from "@/lib/cms";

type Props = {
  pages: LandingPage[];
};

/**
 * Lists every slug from `test-source.csv` (via lib/csvSource.ts).
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
          Statically generated from{" "}
          <code>test-source.csv</code> (see <code>lib/csvSource.ts</code> for column mapping).
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
