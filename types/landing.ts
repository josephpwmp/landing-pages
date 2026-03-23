/**
 * Shared shape for a landing page document.
 * When you move to Strapi, mirror this with a Strapi content-type (or map API fields here).
 */
export type LandingCta = {
  label: string;
  /** Absolute URL or path (e.g. /signup, #estimate) */
  href: string;
};

export type LandingPage = {
  slug: string;
  /** Full &lt;h1&gt; line (e.g. "Window Cleaning Services in Halifax") */
  headline: string;
  /** Hero promo line(s); use \\n for a line break */
  subheadline: string;
  /** Main image in the lead card (below the form) */
  heroImage: string;
  cta: LandingCta;
  /** Shown in CTAs, footer, form hint — display format e.g. 902-890-1752 */
  phone: string;
  /** Optional second line in footer */
  phoneSecondary?: string;
  businessName: string;
  /** Used in copy where the city name is personalized */
  city: string;
  /** e.g. "Cleaning" — headline-style inserts */
  serviceWord: string;
  /** e.g. "cleaning" — sentence-case inserts */
  serviceWordLower: string;
  /** Form post URL; use "#" until your API is ready */
  formAction?: string;
};
