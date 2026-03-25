/**
 * Shared shape for a landing page document.
 * Extended fields come from `data/landing-configs.csv` (generator) when present.
 */
export type LandingCta = {
  label: string;
  href: string;
};

export type LandingReview = {
  name: string;
  text: string;
};

export type LandingImages = {
  logo?: string;
  section2?: string;
  whyChoose?: string;
  /** Up to 6 before/after shots */
  beforeAfter?: string[];
};

export type LandingColors = {
  sectionDark?: string;
  ctaRed?: string;
  ctaGreen?: string;
};

export type LandingPage = {
  slug: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  cta: LandingCta;
  phone: string;
  phoneSecondary?: string;
  businessName: string;
  city: string;
  serviceWord: string;
  serviceWordLower: string;
  formAction?: string;

  /** `generator` when row came from landing-configs.csv */
  source?: "ads_export" | "generator";
  templateKey?: string;
  countiesState?: string;
  /** Extra cities for “service area” list (from generator) */
  serviceCitiesList?: string[];
  discountAmount?: string;
  /** Raw WhatConverts (or other) script — injected client-side */
  whatconvertsScript?: string;
  review1?: LandingReview;
  review2?: LandingReview;
  images?: LandingImages;
  colors?: LandingColors;
};
