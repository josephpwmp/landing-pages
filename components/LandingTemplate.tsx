import Image from "next/image";
import Link from "next/link";
import type { LandingPage } from "@/types/landing";
import { GclidCapture } from "@/components/GclidCapture";

type Props = {
  page: LandingPage;
};

/** Static section assets (from landing.html). Swap or move to CMS later. */
const IMG = {
  lock: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/e9gcby-40299076-0-lock_100j00q000000000000028.png",
  house: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/28b51059-power-pressure-house-washing_1000000000000000000028.png",
  driveway: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/d74e0451-driveway-cleaning_1000000000000000000028.png",
  deck: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/0cd87be5-deck-cleaning_1000000000000000000028.png",
  fence: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/dbc63c3e-fence-cleaning_1000000000000000000028.png",
  roof: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/a24318db-roof-cleaning_1000000000000000000028.png",
  gutter: "https://d9hhrg4mnvzow.cloudfront.net/lp.getwindowcleaningtoday.com/360-mobile-wash/city/c55a9a15-gutter-cleaning_1000000000000000000028.png",
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

/**
 * Full-page template from `landing.html`, driven by CMS fields in `page`.
 * Static sections (services grid, reviews, benefits) stay in markup until you model them in Strapi.
 * (Hero matches the static file: headline + subheadline only — CTAs are sticky bar + form.)
 */
export function LandingTemplate({ page }: Props) {
  const {
    headline,
    subheadline,
    heroImage,
    phone,
    phoneSecondary,
    businessName,
    city,
    serviceWord,
    serviceWordLower,
    formAction,
  } = page;

  const phoneLink = telHref(phone);

  return (
    <div className="landing-template">
      <GclidCapture />

      <header className="hero" id="top">
        <div className="wrap">
          <h1>{headline}</h1>
          <p className="sub">{subheadline}</p>
        </div>
      </header>

      <div className="lead-section">
        <div className="wrap">
          <div className="lead-card" id="estimate">
            <h2>Get A Free &amp; Fast Estimate Below</h2>
            <p className="hint">
              Fill out the form below or call{" "}
              <a href={phoneLink}>{phone}</a> for a same-day estimate. Book your
              service today!
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
                    <span>Your name</span>
                    <input
                      type="text"
                      name="your_name"
                      placeholder="Your Name"
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
                  <span>Tell us about what service you need</span>
                  <textarea
                    name="tell_us_about_what_service_you_need"
                    required
                  />
                </label>
              </div>
              <button type="submit" className="btn btn-primary">
                <strong>Submit</strong>
              </button>
            </form>

            <div className="trust-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.lock} alt="" width={28} height={28} />
              <span>Your information is 100% secure</span>
            </div>

            <div className="lead-card__hero-img">
              <Image
                src={heroImage}
                alt=""
                width={960}
                height={540}
                sizes="(max-width: 1100px) 100vw, 1000px"
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 280,
                  borderRadius: 8,
                  marginInline: "auto",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="services-heading">
        <div className="wrap">
          <h2 id="services-heading">Our Featured Services</h2>
          <div className="services-grid">
            {(
              [
                [IMG.house, "House Washing"],
                [IMG.driveway, "Driveway Cleaning"],
                [IMG.deck, "Deck Cleaning"],
                [IMG.fence, "Fence Cleaning"],
                [IMG.roof, "Roof Cleaning"],
                [IMG.gutter, "Gutter Cleaning"],
              ] as const
            ).map(([src, label]) => (
              <div className="service-item" key={label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  width={120}
                  height={120}
                  style={{ marginInline: "auto" }}
                />
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#e8f0fa" }}>
        <div className="wrap">
          <h2>5-Star Customer Reviews</h2>
          <div className="reviews">
            <article className="review">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="stars" src={IMG.stars} alt="" />
              <p className="name">Mary Markie</p>
              <p>
                They did a great job! We had the siding, windows and gutters
                done. Even though it’s a relatively new house you could still
                see the difference before and after! Definitely recommend
                Mitchell and his team! Thanks again!
              </p>
            </article>
            <article className="review">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="stars" src={IMG.stars} alt="" />
              <p className="name">Cheryl Young</p>
              <p>
                The window washer was helpful and went beyond what was required
                of him. My windows look amazing they give me a clear view.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="hero-card-title">
            Our Window {serviceWord}{" "}
            <span style={{ color: "var(--gold)" }}>Transformations</span>!
          </h2>
          <div className="gallery" style={{ marginTop: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.gal1} alt="Window cleaning result" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.gal2} alt="Window cleaning result" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.gal3} alt="Window cleaning result" />
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontWeight: 600,
              fontSize: "1.25rem",
            }}
          >
            We Make Your Property Look New!
          </p>
          <p style={{ textAlign: "center" }}>
            Contact {businessName} for an estimate by calling{" "}
            <a
              href={phoneLink}
              style={{ color: "var(--blue-mid)", fontWeight: 600 }}
            >
              {phone}
            </a>{" "}
            or completing the form above.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Benefits of Window {serviceWord} Services</h2>
          <div className="benefits">
            <div className="benefit">
              <h3>Extend Window Lifespan</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.lifespan} alt="" />
            </div>
            <div className="benefit">
              <h3>Protect Energy Efficiency</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.energy} alt="" />
            </div>
            <div className="benefit">
              <h3>Saves Money</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.piggy} alt="" />
            </div>
            <div className="benefit">
              <h3>Enhances Aesthetics</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.aesthetics} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap split">
          <div>
            <h2>
              Local Window {serviceWord} Company in {city}!
            </h2>
            <div className="prose">
              <p>
                Are you searching for efficient window {serviceWordLower}{" "}
                services? We’ve got you covered! Here at{" "}
                <strong>{businessName}</strong>, it is our goal to help
                residential clients achieve a cleaner, more comfortable home.
              </p>
              <p>
                Our team specializes in delivering streak-free, clear windows
                that transform homes and offices. Based locally, we’re proud to
                offer unmatched window {serviceWordLower} services.
              </p>
              <p>
                We provide {city} and surrounding areas with excellent service
                year round. Remember to take advantage of our $25 OFF special
                by mentioning “Google Ad” when you call.
              </p>
            </div>
            <p className="cta-row">
              <a className="btn btn-primary" href="#estimate">
                Request estimate
              </a>
              <a className="btn btn-outline" href={phoneLink}>
                Call us now
              </a>
            </p>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.exterior} alt="Exterior window cleaning" />
            <div className="badge-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.gbp} alt="Google" width={80} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.licensed} alt="Licensed and insured" width={120} />
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#fff" }}>
        <div className="wrap">
          <h2>Why Choose {businessName}?</h2>
          <div className="why-grid">
            <div className="why-item">
              <h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG.arrow} alt="" width={24} height={24} />
                Fast &amp; Affordable {serviceWord}
              </h3>
              <p>
                Our window {serviceWordLower} services are swift and
                competitively priced.
              </p>
            </div>
            <div className="why-item">
              <h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG.arrow} alt="" width={24} height={24} />
                Same Day Estimates
              </h3>
              <p>Quick, transparent pricing over the phone.</p>
            </div>
            <div className="why-item">
              <h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG.arrow} alt="" width={24} height={24} />
                Fully Licensed &amp; Insured
              </h3>
              <p>Professional standards and protection for your property.</p>
            </div>
          </div>
          <div className="why-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG.property} alt="Property photo" />
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
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", opacity: 0.9 }}>
          Template from landing.html — replace static copy and images in
          LandingTemplate when you expand the CMS.
        </p>
        <p className="lp-footer__dash">
          <Link href="/dashboard">All landing pages</Link>
        </p>
      </footer>

      <div className="sticky-cta" role="navigation" aria-label="Quick contact">
        <a className="btn btn-primary" href={phoneLink}>
          Call {phone}
        </a>
        <a className="btn btn-outline" href="#estimate">
          Request estimate
        </a>
      </div>
    </div>
  );
}
