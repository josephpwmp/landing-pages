import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { LandingPage } from "@/types/landing";
import { GclidCapture } from "@/components/GclidCapture";
import {
  TEMPLATE_META,
  type TemplateKey,
} from "@/lib/landingConfigConstants";

const WhatConvertsInjector = dynamic(
  () =>
    import("@/components/WhatConvertsInjector").then(
      (m) => m.WhatConvertsInjector
    ),
  { ssr: false }
);

type Props = {
  page: LandingPage;
  /** All cities from merged CSVs — “service area” section */
  serviceAreaCities: string[];
};

/** Static imagery when generator did not supply uploads. */
const IMG = {
  stars: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/adb06479-stars.svg",
  gal1: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/b4a1ab23-window-cleaning-acs-21_108s08s08s08q00000101o.jpeg",
  gal2: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/1a961aa6-window-cleaning-double-check-photo-6_108x08q08s08q00200001o.jpeg",
  gal3: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/7ab2180e-b4b91197-window-cleaning-acs-14-10iq0iq0h80gu00q00w01o_108x08q08s08q00200001o.jpeg",
  lifespan: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/48e3fd93-extend-window-lifespan_101v01v000000000000028.png",
  energy: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/ea8ae655-protect-energy-efficiency_101v01v000000000000028.png",
  piggy: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/7c8c8ea4-piggy-bank-1_101v01v000000000000028.png",
  aesthetics: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/3233a69d-increases-aethestics_101v01v000000000000028.png",
  exterior: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/4de0f305-exterior-window-cleaning-our-main-services_10ap0e900000000000001o.jpeg",
  gbp: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/55ba94e5-gbp_1000000000000000000028.png",
  licensed: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/f0e29b85-licensed-and-insured_103q03b000000000000028.png",
  arrow: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/e564aadd-arrow.svg",
  property: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/aa06ee92-upper-tantallon-_10nv0hw0c40c405l01u01o.jpg",
} as const;

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

function CtaPair({
  phone,
  phoneLink,
}: {
  phone: string;
  phoneLink: string;
}) {
  return (
    <div className="cta-pair">
      <a className="btn btn-call" href={phoneLink}>
        Call Us Now
      </a>
      <a className="btn btn-estimate" href="#estimate">
        Request Estimate
      </a>
    </div>
  );
}

/**
 * Tropical-style layout: top bar, split hero (image + form), red/green CTAs, service area from CSV.
 */
export function LandingTemplate({ page, serviceAreaCities }: Props) {
  const {
    headline,
    subheadline,
    heroImage,
    phone,
    phoneSecondary,
    businessName,
    city,
    serviceWord,
    formAction,
    countiesState,
    discountAmount,
    whatconvertsScript,
    images,
    colors,
    review1,
    review2,
  } = page;

  const tplKey = (page.templateKey as TemplateKey) || "window_cleaning";
  const meta = TEMPLATE_META[tplKey] ?? TEMPLATE_META.window_cleaning;
  const localLabel = meta.localLeadIn;

  const phoneLink = telHref(phone);
  const discount = discountAmount?.trim() || "25";

  const section2Img = images?.section2 || IMG.exterior;
  const whyImg = images?.whyChoose || IMG.property;
  const gallerySrcs =
    images?.beforeAfter && images.beforeAfter.length > 0
      ? images.beforeAfter
      : [IMG.gal1, IMG.gal2, IMG.gal3];

  const r1 = review1 ?? {
    name: "Richard Morris",
    text: `Outstanding crew—on time, professional, and our property has never looked better. Highly recommend ${businessName}.`,
  };
  const r2 = review2 ?? {
    name: "Clay Brashear",
    text: `Fair pricing and great communication from quote to finish. Will use them again.`,
  };

  const serviceSub =
    countiesState?.trim() || "We Service All of Central Florida";

  const cssVars: CSSProperties & Record<string, string> = {};
  if (colors?.sectionDark?.trim()) {
    const d = colors.sectionDark.trim();
    cssVars["--blue-dark"] = d;
    cssVars["--blue-deep"] = d;
  }
  if (colors?.ctaRed?.trim()) {
    cssVars["--cta-red"] = colors.ctaRed.trim();
  }
  if (colors?.ctaGreen?.trim()) {
    cssVars["--cta-green"] = colors.ctaGreen.trim();
  }

  return (
    <div className="landing-template" style={cssVars}>
      <GclidCapture />
      {whatconvertsScript?.trim() ? (
        <WhatConvertsInjector html={whatconvertsScript} />
      ) : null}

      <div className="landing-topbar">
        <div className="wrap landing-topbar__inner">
          <div className="landing-brand">
            {images?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images.logo}
                alt=""
                className="landing-brand__img"
              />
            ) : (
              <span className="landing-brand__icon" aria-hidden>
                🌴
              </span>
            )}
            <div className="landing-brand__text">
              <div className="landing-brand__title">{businessName}</div>
              <div className="landing-brand__sub">{localLabel}</div>
            </div>
          </div>
          <div className="landing-topbar__phone">
            <span className="landing-topbar__label">Call for a free estimate</span>
            <a href={phoneLink} className="landing-topbar__number">
              {phone}
            </a>
          </div>
        </div>
      </div>

      <div className="hero-main">
        <div className="hero-main__head">
          <div className="wrap">
            <h1>{headline}</h1>
            <p className="sub">{subheadline}</p>
          </div>
        </div>

        <div className="wrap hero-split">
          <div className="hero-split__visual">
            <div className="hero-split__img-wrap">
              <Image
                src={heroImage}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                priority
                className="hero-split__img"
                unoptimized={heroImage.startsWith("/uploads/")}
              />
            </div>
          </div>
          <div className="hero-split__form">
            <div className="lead-card" id="estimate">
              <h2>Get A Free &amp; Fast Estimate Below</h2>
              <p className="hint">
                Fill out the form or call{" "}
                <a href={phoneLink}>{phone}</a> for a same-day estimate.
              </p>

              <form
                className="form-grid"
                action={formAction ?? "#"}
                method="post"
                autoComplete="on"
              >
                <input type="hidden" name="gclid" defaultValue="" />
                <div className="form-grid cols-2">
                  <div>
                    <label>
                      <span>Full name</span>
                      <input
                        type="text"
                        name="your_name"
                        placeholder="Full Name"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      <span>Email</span>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      <span>Phone</span>
                      <input
                        type="tel"
                        name="phone_number"
                        placeholder="Phone Number"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      <span>Address</span>
                      <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        required
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label>
                    <span>Tell us what you need!</span>
                    <textarea
                      name="tell_us_about_what_service_you_need"
                      required
                    />
                  </label>
                </div>
                <button type="submit" className="btn btn-submit">
                  Submit
                </button>
              </form>

              <div className="trust-badges">
                <div className="trust-badges__item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG.gbp} alt="" width={72} height={72} />
                  <div>
                    <div className="trust-badges__line">Google</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="trust-badges__stars"
                      src={IMG.stars}
                      alt=""
                      width={100}
                      height={20}
                    />
                  </div>
                </div>
                <div className="trust-badges__badge">100% Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section section--light">
        <div className="wrap">
          <div className="split split--media-left">
            <div className="split__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={section2Img} alt={`${localLabel} services`} />
            </div>
            <div className="split__content">
              <h2>Local {localLabel} Company Near You!</h2>
              <div className="prose">
                <p>
                  Looking for reliable {localLabel.toLowerCase()} near {city}?
                  <strong> {businessName}</strong> delivers professional results
                  and friendly service
                  {countiesState ? ` across ${countiesState}` : " in your area"}.
                </p>
                <p>
                  We treat every home like our own. Mention you saw our Google
                  ad and get <strong>${discount} off</strong> when you book.
                </p>
              </div>
              <CtaPair phone={phone} phoneLink={phoneLink} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap">
          <h2 className="h2-banner">
            Our {localLabel}{" "}
            <span className="h2-banner__accent">Transformations</span>!
          </h2>
          <div className="gallery">
            {gallerySrcs.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${src}-${i}`}
                src={src}
                alt={`Before and after ${localLabel}`}
              />
            ))}
          </div>
          <div className="section--dark__cta">
            <CtaPair phone={phone} phoneLink={phoneLink} />
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="wrap">
          <h2>Why Choose {businessName}?</h2>
          <div className="split split--media-left split--why">
            <div className="split__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={whyImg} alt="Our team" />
            </div>
            <div className="split__content">
              <ul className="why-list">
                <li>
                  <span className="why-list__icon" aria-hidden>
                    ✓
                  </span>
                  <div>
                    <strong>Fast &amp; Affordable {serviceWord}</strong>
                    <p>
                      Quick scheduling and fair pricing so your property looks
                      its best without the wait.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="why-list__icon" aria-hidden>
                    ✓
                  </span>
                  <div>
                    <strong>Same Day Estimates</strong>
                    <p>
                      Call for a transparent quote—often same day—so you know
                      exactly what to expect.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="why-list__icon" aria-hidden>
                    ✓
                  </span>
                  <div>
                    <strong>Fully Licensed &amp; Insured</strong>
                    <p>
                      Peace of mind with professional crews and coverage on
                      every job.
                    </p>
                  </div>
                </li>
              </ul>
              <CtaPair phone={phone} phoneLink={phoneLink} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="wrap">
          <h2>Benefits of {localLabel} Services</h2>
          <div className="benefits benefits--row">
            <div className="benefit">
              <h3>Extend Window Lifespan</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.lifespan} alt="" />
            </div>
            <div className="benefit">
              <h3>Boost Energy Efficiency</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.energy} alt="" />
            </div>
            <div className="benefit">
              <h3>Save Money</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.piggy} alt="" />
            </div>
            <div className="benefit">
              <h3>Enhance Aesthetics</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.aesthetics} alt="" />
            </div>
          </div>
          <div className="section__cta-wrap">
            <CtaPair phone={phone} phoneLink={phoneLink} />
          </div>
        </div>
      </section>

      <section className="section section--dark section--service">
        <div className="wrap">
          <h2>{localLabel} In Your Area!</h2>
          <p className="section--service__sub">{serviceSub}</p>
          <ul className="service-area-grid">
            {serviceAreaCities.map((c) => (
              <li key={c}>
                <span className="service-area-grid__pin" aria-hidden>
                  📍
                </span>
                {c}
              </li>
            ))}
          </ul>
          <p className="section--service__foot">
            And surrounding areas! Reach out to see if we service your area—we
            probably do.
          </p>
          <div className="section--dark__cta">
            <CtaPair phone={phone} phoneLink={phoneLink} />
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="wrap">
          <h2>5-Star Customer Reviews</h2>
          <div className="reviews">
            <article className="review">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="stars" src={IMG.stars} alt="" />
              <p className="name">{r1.name}</p>
              <p>{r1.text}</p>
            </article>
            <article className="review">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="stars" src={IMG.stars} alt="" />
              <p className="name">{r2.name}</p>
              <p>{r2.text}</p>
            </article>
          </div>
          <p className="closing-line">We Make Your Property Look New!</p>
          <p className="closing-phone">
            <a href={phoneLink}>{phone}</a>
          </p>
          <div className="section__cta-wrap">
            <CtaPair phone={phone} phoneLink={phoneLink} />
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <p>
          {businessName}
          {phoneSecondary ? (
            <>
              {" "}
              | <a href={telHref(phoneSecondary)}>{phoneSecondary}</a>
            </>
          ) : null}{" "}
          · <a href={phoneLink}>{phone}</a>
        </p>
        <p className="lp-footer__fine">
          {countiesState?.trim() || "Central Florida"} · Serving {city}
          {serviceAreaCities.length ? " and nearby cities" : ""}
        </p>
        <p className="lp-footer__dash">
          <Link href="/dashboard">All landing pages</Link>
        </p>
      </footer>

      <div className="sticky-cta" role="navigation" aria-label="Quick contact">
        <a className="btn btn-call" href={phoneLink}>
          Call {phone}
        </a>
        <a className="btn btn-estimate" href="#estimate">
          Request Estimate
        </a>
      </div>
    </div>
  );
}
