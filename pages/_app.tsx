import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "@/styles/globals.css";
import "@/styles/landing-template.css";
import "@/styles/generator.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const on = router.pathname.startsWith("/landing");
    document.body.classList.toggle("page-landing", on);
    return () => document.body.classList.remove("page-landing");
  }, [router.pathname]);

  return <Component {...pageProps} />;
}
