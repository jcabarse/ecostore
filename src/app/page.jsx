"use client";
import { useRef } from 'react';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import LocationMap from '../components/LocationMap';
import CookieConsent from '../components/CookieConsent';
import { Reveal, TiltCard, FloatingLeaves, ScrollProgress } from '../components/MotionKit';
import { STORE, fullAddress } from '../lib/storeInfo';

/* ------------------------------------------------------------
   EDIT YOUR WORDS HERE — these blocks are the landing-page copy.
------------------------------------------------------------ */
const HERO_LINE = 'Plastic-free, eco-friendly essentials for everyday life.';

const ABOUT_COPY = [
  `The ${STORE.name} of ${STORE.barangay} is a small shop in ${STORE.city}, ${STORE.province}, dedicated to making sustainable living easy.`,
  'We curate plastic-free, eco-friendly essentials for your everyday life, so choosing better for the planet never has to feel complicated.',
];

const PILLARS = [
  { icon: '🌿', title: 'Plastic-free', text: 'Everyday swaps that cut single-use plastic out of your routine.' },
  { icon: '♻️', title: 'Eco-friendly', text: 'Products chosen with the planet in mind.' },
  { icon: '🧺', title: 'Curated', text: 'A focused collection of essentials, not an endless aisle.' },
  { icon: '📍', title: `Rooted in ${STORE.barangay.replace('Brgy. ', '')}`, text: `Proudly based in ${STORE.city}, ${STORE.province}.` },
];

const STEPS = [
  { n: '1', title: 'Browse the catalog', text: 'Explore our plastic-free, eco-friendly essentials on the Products page.' },
  { n: '2', title: 'Add what you love', text: 'Put your favorites in the cart and adjust quantities any time.' },
  { n: '3', title: 'Check out', text: 'Complete your order in a few simple steps.' },
];

const ORMOC_BLURB =
  "Ormoc is a port city at the head of Ormoc Bay on Leyte's western coast, and the hub of western Leyte. Brgy. Alegria is one of its barangays.";

function Eyebrow({ children }) {
  return <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#40916C]">{children}</p>;
}

function InfoCard({ icon, label, children, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="flex gap-4 rounded-2xl border border-[#B7E4C7]/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E9F5EE] text-xl" aria-hidden="true">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#40916C]">{label}</p>
          <div className="mt-1 text-[15px] leading-relaxed text-[#1B4332]">{children}</div>
        </div>
      </div>
    </Reveal>
  );
}

export default function LandingPage() {
  const heroRef = useRef(null);

  // Hero spotlight follows the cursor (CSS variables, no re-render)
  const onHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      <ScrollProgress />
      <FloatingLeaves count={12} />
      <SiteNav morph />

      <main className="relative z-10">
        {/* ============ HERO: the big logo lives here (it is drawn by SiteNav) ============ */}
        <section
          ref={heroRef}
          onPointerMove={onHeroMove}
          className="relative h-screen min-h-[660px] overflow-hidden"
        >
          <h1 className="sr-only">
            {STORE.name} — {STORE.barangay}, {STORE.city}, {STORE.province}
          </h1>

          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#E9F5EE] via-[#FDFBF7] to-[#FDFBF7]" />
            <div className="aurora -left-24 -top-24 h-[28rem] w-[28rem] bg-[#52B788]/40" />
            <div className="aurora -right-32 top-1/4 h-[32rem] w-[32rem] bg-[#B7E4C7]/70" style={{ animationDelay: '-6s' }} />
            <div className="aurora -bottom-40 left-1/3 h-[26rem] w-[26rem] bg-[#1B4332]/20" style={{ animationDelay: '-11s' }} />
            <div className="hero-spot absolute inset-0" />
          </div>

          <div className="absolute inset-x-0 top-[60%] px-6 text-center">
            <Reveal delay={1000}>
              <p className="mx-auto max-w-xl text-lg text-[#1B4332]/80 sm:text-xl">{HERO_LINE}</p>
            </Reveal>
            <Reveal delay={1250}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/products"
                  className="rounded-full bg-[#1B4332] px-8 py-3.5 text-base font-semibold text-[#FDFBF7] shadow-lg shadow-[#1B4332]/25 transition hover:-translate-y-0.5 hover:bg-[#2D6A4F]"
                >
                  Shop Products
                </Link>
                <a
                  href="#visit"
                  className="rounded-full border-2 border-[#1B4332]/25 bg-white/50 px-8 py-3.5 text-base font-semibold text-[#1B4332] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#1B4332]/60"
                >
                  Find Us
                </a>
              </div>
            </Reveal>
          </div>

          <a
            href="#about"
            aria-label="Scroll to learn more"
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#1B4332]/60"
          >
            Scroll
            <span className="relative block h-9 w-5 rounded-full border-2 border-[#1B4332]/40">
              <span className="scroll-cue-dot absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1B4332]" />
            </span>
          </a>
        </section>

        {/* ============ ABOUT ============ */}
        <section id="about" className="scroll-mt-24 px-6 py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
            <div>
              <Reveal><Eyebrow>About us</Eyebrow></Reveal>
              <Reveal delay={100}>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1B4332] sm:text-4xl">
                  What is the {STORE.name}?
                </h2>
              </Reveal>
              {ABOUT_COPY.map((para, i) => (
                <Reveal key={i} delay={200 + i * 100}>
                  <p className="mt-5 text-lg leading-relaxed text-gray-600">{para}</p>
                </Reveal>
              ))}
              <Reveal delay={450}>
                <Link
                  href="/products"
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-[#1B4332] underline-offset-4 hover:underline"
                >
                  Explore the collection <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i * 120}>
                  <TiltCard className="h-full rounded-2xl bg-white p-6">
                    <div className="text-3xl" aria-hidden="true">{p.icon}</div>
                    <h3 className="mt-3 text-lg font-bold text-[#1B4332]">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{p.text}</p>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <Reveal><Eyebrow>How it works</Eyebrow></Reveal>
              <Reveal delay={100}>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1B4332] sm:text-4xl">
                  Three simple steps
                </h2>
              </Reveal>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 140}>
                  <div className="relative h-full rounded-3xl border border-[#B7E4C7]/70 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#52B788] to-[#1B4332] text-xl font-extrabold text-white shadow-lg shadow-[#1B4332]/25">
                      {s.n}
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-[#1B4332]">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ VISIT US + MAP ============ */}
        <section id="visit" className="scroll-mt-24 bg-gradient-to-b from-transparent via-[#E9F5EE]/70 to-transparent px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <Reveal><Eyebrow>Visit us</Eyebrow></Reveal>
              <Reveal delay={100}>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1B4332] sm:text-4xl">
                  Find us in {STORE.city}, {STORE.province}
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                  We’re in {STORE.barangay}. Scroll the map into view and watch it travel from the Philippines down to our doorstep.
                </p>
              </Reveal>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
              <div className="space-y-4">
                <InfoCard icon="📍" label="Address">
                  {fullAddress}
                </InfoCard>
                <InfoCard icon="🧭" label="Region" delay={100}>
                  {STORE.region}
                  <span className="block text-sm text-gray-500">
                    Approx. {STORE.lat.toFixed(4)}° N, {STORE.lng.toFixed(4)}° E
                  </span>
                </InfoCard>
                {STORE.hours && (
                  <InfoCard icon="🕒" label="Opening hours" delay={150}>{STORE.hours}</InfoCard>
                )}
                {(STORE.phone || STORE.email || STORE.facebook) && (
                  <InfoCard icon="💬" label="Contact" delay={200}>
                    {STORE.phone && <span className="block">{STORE.phone}</span>}
                    {STORE.email && <span className="block">{STORE.email}</span>}
                    {STORE.facebook && (
                      <a className="block font-semibold underline-offset-4 hover:underline" href={STORE.facebook} target="_blank" rel="noopener noreferrer">
                        Facebook page
                      </a>
                    )}
                  </InfoCard>
                )}
                <InfoCard icon="🌊" label="About Ormoc" delay={250}>
                  <span className="text-sm text-gray-600">{ORMOC_BLURB}</span>
                </InfoCard>
              </div>

              <LocationMap />
            </div>
          </div>
        </section>

        {/* ============ CALL TO ACTION ============ */}
        <section className="px-6 pb-24 pt-8">
          <Reveal>
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#1B4332] px-8 py-16 text-center shadow-2xl shadow-[#1B4332]/30">
              <div aria-hidden="true" className="aurora -right-16 -top-24 h-72 w-72 bg-[#52B788]/40" />
              <div aria-hidden="true" className="aurora -bottom-24 -left-16 h-72 w-72 bg-[#B7E4C7]/25" style={{ animationDelay: '-8s' }} />
              <div className="relative">
                <h2 className="text-3xl font-extrabold tracking-tight text-[#FDFBF7] sm:text-4xl">
                  Ready to live a little greener?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-[#B7E4C7]">
                  Browse our plastic-free, eco-friendly essentials and make the swap today.
                </p>
                <Link
                  href="/products"
                  className="mt-8 inline-block rounded-full bg-[#FDFBF7] px-9 py-4 text-base font-bold text-[#1B4332] shadow-lg transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Shop Products
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
      <CookieConsent />
    </div>
  );
}