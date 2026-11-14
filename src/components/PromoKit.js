"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------
   EDIT YOUR PROMOS HERE — change the numbers/codes in one place.
------------------------------------------------------------ */
export const PROMOS = {
  welcomeCode: 'ECO10',
  welcomePercent: 10,
  bundlePercent: 15,
  freeDeliveryMin: '$1.50',
};

export const TICKER_ITEMS = [
  `🌿 ${PROMOS.welcomePercent}% off your first order · code ${PROMOS.welcomeCode}`,
  `🚚 Free delivery on orders over ${PROMOS.freeDeliveryMin}`,
  `🎁 Starter bundle: charcoal + pots + rugs, save ${PROMOS.bundlePercent}%`,
  '♻️ Swap one plastic item this week',
];

/* ---------- Scrolling offer strip ---------- */
export function PromoTicker() {
  const row = TICKER_ITEMS.map((t, i) => (
    <span key={i} className="mx-8 inline-flex items-center whitespace-nowrap text-sm font-semibold text-[#FDFBF7]">
      {t}
    </span>
  ));
  return (
    <div className="relative z-10 overflow-hidden bg-[#1B4332] py-3" role="region" aria-label="Current offers">
      <style>{`
        @keyframes promo-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .promo-track { display: flex; width: max-content; animation: promo-marquee 32s linear infinite; }
        .promo-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .promo-track { animation: none; flex-wrap: wrap; width: auto; justify-content: center; }
          .promo-dup { display: none; }
        }
      `}</style>
      <div className="promo-track">
        <div className="flex">{row}</div>
        <div className="promo-dup flex" aria-hidden="true">{row}</div>
      </div>
    </div>
  );
}

/* ---------- Weekly countdown (ends Sunday 11:59 PM, local time) ---------- */
function weekEnd() {
  const d = new Date();
  const add = (7 - d.getDay()) % 7; // days until Sunday (0 if today is Sunday)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + add, 23, 59, 59, 999);
}

export function Countdown() {
  const [left, setLeft] = useState(null); // null until mounted → no hydration mismatch

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, weekEnd() - new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const s = left === null ? null : Math.floor(left / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  const parts = [
    ['Days', s === null ? '--' : pad(Math.floor(s / 86400))],
    ['Hrs', s === null ? '--' : pad(Math.floor((s % 86400) / 3600))],
    ['Min', s === null ? '--' : pad(Math.floor((s % 3600) / 60))],
    ['Sec', s === null ? '--' : pad(s % 60)],
  ];

  return (
    <div className="flex items-center gap-2" role="timer" aria-label="Time left on this week's deals">
      {parts.map(([label, value]) => (
        <div key={label} className="min-w-[3.4rem] rounded-xl border border-[#B7E4C7] bg-white px-2 py-1.5 text-center shadow-sm">
          <div className="text-xl font-extrabold tabular-nums leading-none text-[#1B4332]">{value}</div>
          <div className="mt-1 text-[10px] font-semibold text-[#40916C]">{label}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Deal card ---------- */
export function DealCard({ ribbon, big, title, text, code, note, href, cta, dark = false }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the code is still visible to type */
    }
  };

  const shell = dark
    ? 'bg-[#1B4332] text-[#FDFBF7] shadow-2xl shadow-[#1B4332]/25'
    : 'border border-[#B7E4C7]/70 bg-white/90 text-[#1B4332] shadow-sm backdrop-blur-sm';
  const muted = dark ? 'text-[#B7E4C7]' : 'text-gray-600';

  return (
    <div className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition hover:-translate-y-1 ${shell}`}>
      {dark && <div aria-hidden="true" className="aurora -right-16 -top-20 h-60 w-60 bg-[#52B788]/40" />}

      {ribbon && (
        <span className="absolute right-5 top-5 rounded-full bg-[#F4B942] px-3 py-1 text-xs font-bold text-[#1B4332]">
          {ribbon}
        </span>
      )}

      <div className="relative flex flex-1 flex-col">
        <p className={`text-5xl font-extrabold tracking-tight ${dark ? 'text-[#F4B942]' : 'text-[#2D6A4F]'}`}>{big}</p>
        <h3 className="mt-3 text-xl font-bold">{title}</h3>
        <p className={`mt-2 flex-1 text-[15px] leading-relaxed ${muted}`}>{text}</p>

        {code ? (
          <button
            type="button"
            onClick={copy}
            className={`mt-6 flex w-full items-center justify-between rounded-xl border-2 border-dashed px-4 py-3 text-left transition ${
              dark ? 'border-[#B7E4C7]/50 hover:border-[#B7E4C7]' : 'border-[#52B788]/60 hover:border-[#1B4332]'
            }`}
            aria-label={`Copy code ${code}`}
          >
            <span className="text-lg font-extrabold tracking-widest">{code}</span>
            <span className="text-sm font-semibold" aria-live="polite">{copied ? 'Copied!' : 'Copy code'}</span>
          </button>
        ) : (
          <p className={`mt-6 rounded-xl px-4 py-3 text-sm font-semibold ${dark ? 'bg-white/10' : 'bg-[#E9F5EE]'}`}>
            {note}
          </p>
        )}

        {href && (
          <Link
            href={href}
            className={`mt-4 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
              dark ? 'bg-[#FDFBF7] text-[#1B4332] hover:bg-white' : 'bg-[#1B4332] text-[#FDFBF7] hover:bg-[#2D6A4F]'
            }`}
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}
