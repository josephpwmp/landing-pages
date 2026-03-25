import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Data-driven landing pages</title>
      </Head>
      <main className="dashboard">
        <h1>Sample project</h1>
        <p className="dashboard__lead">
          Dynamic landing pages from mock CMS data. Open the dashboard to browse
          all slugs.
        </p>
        <nav className="home-nav">
          <Link href="/dashboard">Dashboard (all slugs)</Link>
          <Link href="/landing-generator">Landing Page Generator</Link>
          <Link href="/landing/orlando">Example: /landing/orlando</Link>
        </nav>
      </main>
    </>
  );
}
