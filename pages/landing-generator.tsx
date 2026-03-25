import Head from "next/head";
import Link from "next/link";
import type { FormEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  TEMPLATE_OPTIONS,
  type TemplateKey,
} from "@/lib/landingConfigConstants";
const DEFAULT_COLORS = {
  section: "#071a30",
  ctaRed: "#c62828",
  ctaGreen: "#2e7d32",
} as const;

export default function LandingGeneratorPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [templateKey, setTemplateKey] =
    useState<TemplateKey>("pressure_washing");
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [photoCount, setPhotoCount] = useState<"3" | "6">("3");
  const details1 = useRef<HTMLDetailsElement>(null);
  const details2 = useRef<HTMLDetailsElement>(null);
  const details3 = useRef<HTMLDetailsElement>(null);
  const [status, setStatus] = useState<
    { type: "ok"; slug: string; path: string } | { type: "err"; msg: string } | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  const colorSection = useRef<HTMLInputElement>(null);
  const colorRed = useRef<HTMLInputElement>(null);
  const colorGreen = useRef<HTMLInputElement>(null);

  const expandAll = useCallback(() => {
    for (const r of [details1, details2, details3]) {
      if (r.current) r.current.open = true;
    }
  }, []);

  const addCity = useCallback(() => {
    const t = cityInput.trim();
    if (!t) return;
    if (cities.length >= 12) return;
    if (cities.includes(t)) return;
    setCities((c) => [...c, t]);
    setCityInput("");
  }, [cityInput, cities]);

  const removeCity = useCallback((c: string) => {
    setCities((prev) => prev.filter((x) => x !== c));
  }, []);

  const citiesJson = useMemo(() => JSON.stringify(cities), [cities]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    fd.set("template_key", templateKey);
    fd.set("cities_json", citiesJson);
    fd.set("photo_count", photoCount);
    fd.set(
      "color_section_bg",
      colorSection.current?.value ?? DEFAULT_COLORS.section
    );
    fd.set("color_cta_red", colorRed.current?.value ?? DEFAULT_COLORS.ctaRed);
    fd.set(
      "color_cta_green",
      colorGreen.current?.value ?? DEFAULT_COLORS.ctaGreen
    );

    try {
      const res = await fetch("/api/save-landing-config", {
        method: "POST",
        body: fd,
      });
      const text = await res.text();
      const trimmed = text.trim();

      let data: { ok: boolean; slug?: string; landingPath?: string; error?: string };
      try {
        data = JSON.parse(text) as typeof data;
      } catch {
        const isHtml = trimmed.startsWith("<!") || trimmed.startsWith("<html");
        setStatus({
          type: "err",
          msg: isHtml
            ? `The server returned a web page instead of JSON (${res.status}). Run this app with \`npm run dev\` or \`npm start\` so /api routes work — static export and plain file:// cannot run API routes.`
            : `Invalid response (${res.status}). ${trimmed.slice(0, 200)}`,
        });
        return;
      }

      if (!data.ok) {
        setStatus({ type: "err", msg: data.error || "Request failed" });
        return;
      }
      if (!data.slug || !data.landingPath) {
        setStatus({ type: "err", msg: "Malformed success response from server." });
        return;
      }
      setStatus({
        type: "ok",
        slug: data.slug,
        path: data.landingPath,
      });
      formRef.current?.reset();
      setCities([]);
      setTemplateKey("pressure_washing");
    } catch (err) {
      setStatus({
        type: "err",
        msg: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Landing Page Generator</title>
      </Head>
      <div className="gen-page">
        <div className="gen-wrap">
          <nav className="gen-nav" aria-label="Breadcrumb">
            <span>Google Ads Tools</span>
            <span className="gen-nav__sep">·</span>
            <span>Onboarding</span>
            <span className="gen-nav__sep">·</span>
            <span>QA</span>
            <span className="gen-nav__sep">·</span>
            <span>LSA Weekly</span>
            <span className="gen-nav__sep">·</span>
            <span>Landing Pages</span>
            <span className="gen-nav__sep">·</span>
            <Link href="/dashboard">Dashboard</Link>
            <span className="gen-nav__sep">·</span>
            <Link href="/">Home</Link>
          </nav>

          <h1 className="gen-title">Landing Page Generator</h1>
          <p className="gen-sub">
            Generate customized landing pages from templates. Submissions append
            a row to <code>data/landing-configs.csv</code> (same file as migrated
            Google Ads data) and upload images to{" "}
            <code>public/uploads/landing/</code>. After updating{" "}
            <code>test-source.csv</code>, run <code>npm run migrate:csv</code> to
            merge new ad rows. Run <code>npm run build</code> so new slugs appear
            as static routes.
          </p>

          <form ref={formRef} onSubmit={onSubmit} encType="multipart/form-data">
            <div className="gen-card">
              <h2>Landing Page Templates</h2>
              <div className="gen-templates-toolbar">
                <span>Show:</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = details1.current;
                    if (el) el.open = !el.open;
                  }}
                >
                  Template #1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = details2.current;
                    if (el) el.open = !el.open;
                  }}
                >
                  Template #2
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = details3.current;
                    if (el) el.open = !el.open;
                  }}
                >
                  Template #3
                </button>
                <button type="button" onClick={expandAll}>
                  Expand All
                </button>
              </div>

              <details ref={details1} className="gen-details" open>
                <summary>Template #1</summary>
                <div className="gen-radio-grid">
                  {TEMPLATE_OPTIONS.map((opt) => (
                    <label key={opt.value}>
                      <input
                        type="radio"
                        name="template_key_radio"
                        checked={templateKey === opt.value}
                        onChange={() => setTemplateKey(opt.value)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </details>

              <details ref={details2} className="gen-details">
                <summary>Template #2</summary>
                <p className="gen-muted">
                  Same layout engine as Template #1 — pick the service type above.
                </p>
              </details>

              <details ref={details3} className="gen-details">
                <summary>Template #3</summary>
                <p className="gen-muted">
                  Same layout engine as Template #1 — pick the service type above.
                </p>
              </details>
            </div>

            <div className="gen-card">
              <h2>Brand &amp; Contact</h2>
              <div className="gen-row2">
                <div className="gen-field">
                  <label>
                    <span>Brand Name *</span>
                    <input
                      name="brand_name"
                      type="text"
                      placeholder="ABC Pressure Washing"
                      required
                      autoComplete="organization"
                    />
                  </label>
                </div>
                <div className="gen-field">
                  <label>
                    <span>URL slug (optional)</span>
                    <input
                      name="slug"
                      type="text"
                      placeholder="tampa-pressure-washing"
                    />
                  </label>
                  <p className="gen-hint">
                    Leave blank to derive from main city + template. Must be unique
                    in <code>landing-configs.csv</code>.
                  </p>
                </div>
              </div>
              <div className="gen-row2">
                <div className="gen-field">
                  <label>
                    <span>Phone Number *</span>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="813-555-1234"
                      required
                      autoComplete="tel"
                    />
                  </label>
                </div>
                <div className="gen-field">
                  <label>
                    <span>Call Extension Number</span>
                    <input
                      name="call_extension"
                      type="tel"
                      placeholder="813-555-1234 (defaults to main phone)"
                      autoComplete="tel-national"
                    />
                  </label>
                  <p className="gen-hint">
                    Google Ads call extension number shown in footer
                  </p>
                </div>
              </div>
            </div>

            <div className="gen-card">
              <h2>Offer</h2>
              <div className="gen-field">
                <label>
                  <span>Discount Amount</span>
                  <div className="gen-discount">
                    <span>$</span>
                    <input
                      name="discount_amount"
                      type="number"
                      min={0}
                      placeholder="75"
                      defaultValue=""
                    />
                  </div>
                </label>
                <p className="gen-hint">Leave blank to keep default ($75)</p>
              </div>
            </div>

            <div className="gen-card">
              <h2>Tracking</h2>
              <div className="gen-field">
                <label>
                  <span>WhatConverts Script</span>
                  <textarea
                    name="whatconverts_script"
                    placeholder="Paste WhatConverts tracking script here..."
                  />
                </label>
              </div>
            </div>

            <div className="gen-card">
              <h2>Location</h2>
              <div className="gen-field">
                <label>
                  <span>Counties &amp; State</span>
                  <input
                    name="counties_state"
                    type="text"
                    placeholder="Hillsborough, Pinellas, Pasco Counties, FL"
                  />
                </label>
                <p className="gen-hint">
                  Used in “We service…” text sections
                </p>
              </div>
              <div className="gen-field">
                <label>
                  <span>Main City *</span>
                  <input
                    name="main_city"
                    type="text"
                    placeholder="Tampa"
                    required
                  />
                </label>
                <p className="gen-hint">DTR fallback city name for GEO templates</p>
              </div>
              <div className="gen-field">
                <span className="gen-label">Cities</span>
                <div className="gen-cities">
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCity();
                      }
                    }}
                    placeholder="Enter city name..."
                  />
                  <button type="button" onClick={addCity}>
                    Add
                  </button>
                </div>
                <p className="gen-hint">
                  {cities.length} of 12 cities
                </p>
                <div className="gen-chip-list">
                  {cities.map((c) => (
                    <span key={c} className="gen-chip">
                      {c}
                      <button
                        type="button"
                        onClick={() => removeCity(c)}
                        aria-label={`Remove ${c}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="gen-card">
              <h2>Customer Reviews</h2>
              <div className="gen-row2">
                <div className="gen-field">
                  <span className="gen-label">Review 1</span>
                  <label>
                    <span>Reviewer Name</span>
                    <input name="review1_name" type="text" placeholder="John D." />
                  </label>
                  <label>
                    <span>Review Text</span>
                    <textarea
                      name="review1_text"
                      placeholder="Great service! They did an amazing job..."
                    />
                  </label>
                </div>
                <div className="gen-field">
                  <span className="gen-label">Review 2</span>
                  <label>
                    <span>Reviewer Name</span>
                    <input name="review2_name" type="text" placeholder="John D." />
                  </label>
                  <label>
                    <span>Review Text</span>
                    <textarea
                      name="review2_text"
                      placeholder="Great service! They did an amazing job..."
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="gen-card">
              <h2>Photos</h2>
              <div className="gen-field">
                <span className="gen-label">Before/After Photos</span>
                <div className="gen-radio-grid">
                  <label>
                    <input
                      type="radio"
                      name="photo_count_radio"
                      checked={photoCount === "3"}
                      onChange={() => setPhotoCount("3")}
                    />
                    <span>3 Photos</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="photo_count_radio"
                      checked={photoCount === "6"}
                      onChange={() => setPhotoCount("6")}
                    />
                    <span>6 Photos</span>
                  </label>
                </div>
              </div>
              <div className="gen-field">
                <label>
                  <span>Company Logo</span>
                  <input
                    className="gen-file"
                    name="logo"
                    type="file"
                    accept="image/*"
                  />
                </label>
              </div>
              <div className="gen-field">
                <label>
                  <span>Contact Form Image (hero)</span>
                  <input
                    className="gen-file"
                    name="contact_image"
                    type="file"
                    accept="image/*"
                  />
                </label>
              </div>
              <div className="gen-field">
                <label>
                  <span>Second Section Image</span>
                  <input
                    className="gen-file"
                    name="section2_image"
                    type="file"
                    accept="image/*"
                  />
                </label>
              </div>
              <div className="gen-field">
                <label>
                  <span>Why Choose Us Image</span>
                  <input
                    className="gen-file"
                    name="why_choose_image"
                    type="file"
                    accept="image/*"
                  />
                </label>
              </div>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="gen-field"
                  style={{ display: n <= (photoCount === "6" ? 6 : 3) ? "block" : "none" }}
                >
                  <label>
                    <span>Before/After Image {n}</span>
                    <input
                      className="gen-file"
                      name={`ba${n}`}
                      type="file"
                      accept="image/*"
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="gen-card">
              <h2>Colors</h2>
              <p className="gen-hint" style={{ marginTop: 0 }}>
                Primary Sections — dark blue section backgrounds · CTA Buttons (Red)
                — Call Us Now · CTA Buttons (Green) — Request Estimate
              </p>
              <div className="gen-colors">
                <div className="gen-field">
                  <label>
                    <span>Primary sections</span>
                    <input
                      ref={colorSection}
                      type="color"
                      defaultValue={DEFAULT_COLORS.section}
                    />
                  </label>
                </div>
                <div className="gen-field">
                  <label>
                    <span>CTA (red)</span>
                    <input
                      ref={colorRed}
                      type="color"
                      defaultValue={DEFAULT_COLORS.ctaRed}
                    />
                  </label>
                </div>
                <div className="gen-field">
                  <label>
                    <span>CTA (green)</span>
                    <input
                      ref={colorGreen}
                      type="color"
                      defaultValue={DEFAULT_COLORS.ctaGreen}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="gen-card">
              <h2>Form endpoint (optional)</h2>
              <div className="gen-field">
                <label>
                  <span>Lead form POST URL</span>
                  <input
                    name="form_action_url"
                    type="url"
                    placeholder="https://…"
                  />
                </label>
                <p className="gen-hint">Defaults to # if empty</p>
              </div>
            </div>

            <div className="gen-submit">
              <button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Generate Landing Page"}
              </button>
            </div>

            {status?.type === "ok" ? (
              <div className="gen-msg gen-msg--ok">
                Saved. Preview after rebuild:{" "}
                <Link href={status.path}>
                  {status.path}
                </Link>{" "}
                (slug: <code>{status.slug}</code>)
              </div>
            ) : null}
            {status?.type === "err" ? (
              <div className="gen-msg gen-msg--err">{status.msg}</div>
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
}
