"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import EcoLogo from './EcoLogo';
import { STORE } from '../lib/storeInfo';

export const NAV_HEIGHT = 72;

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#visit', label: 'Visit Us' },
  { href: '/products', label: 'Products' },
  { href: '/account', label: 'Account' },
];

/**
 * SiteNav
 *  - morph={true}  (landing page): the logo starts HUGE in the middle of the
 *    screen and glides into the top-left corner as you scroll.
 *  - morph={false} (other pages): the logo sits in the corner from the start.
 *  - cartCount / onCartClick: optional. When onCartClick is given, a cart
 *    button with a bouncing badge appears (used on the Products page).
 */
export default function SiteNav({ morph = false, cartCount = 0, onCartClick }) {
  const pathname = usePathname();
  const logoRef = useRef(null);
  const tagRef = useRef(null);
  const bgRef = useRef(null);
  const rightRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const logo = logoRef.current;
    const tag = tagRef.current;
    const bg = bgRef.current;
    const right = rightRef.current;
    if (!logo || !tag || !bg || !right) return;

    let raf = 0;

    const apply = () => {
      raf = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = logo.offsetWidth;
      const h = logo.offsetHeight;

      // How far you scroll before the logo reaches the corner
      const range = Math.max(240, vh * 0.5);
      const p = morph ? clamp(window.scrollY / range, 0, 1) : 1;
      const e = ease(p);

      // Big starting size (leaves room for the tagline underneath)
      const wide = Math.max(w, 230);
      const startScale = Math.min(3.6, (vw * 0.84) / wide);
      const scale = startScale + (1 - startScale) * e;

      // Start: centered, a bit above the middle. End: top-left, lined up with the page content.
      const padX = vw < 640 ? 16 : 28;
      const endX = Math.max(0, (vw - 1152) / 2) + padX;
      const endY = (NAV_HEIGHT - h) / 2;
      const startX = (vw - w * startScale) / 2;
      const startY = vh * 0.34 - (h * startScale) / 2;

      const x = startX + (endX - startX) * e;
      const y = startY + (endY - startY) * e;

      logo.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      logo.style.opacity = '1';

      // Tagline fades out quickly while the logo shrinks
      tag.style.opacity = String(clamp(1 - p * 3.5, 0, 1));

      // Header bar + links fade in as the logo arrives
      const show = clamp((p - 0.55) / 0.45, 0, 1);
      bg.style.opacity = String(show);
      right.style.opacity = String(show);
      right.style.pointerEvents = show > 0.6 ? 'auto' : 'none';
      right.style.transform = `translateY(${(1 - show) * -8}px)`;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [morph]);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const onLogoClick = (e) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Logo — one fixed element that is moved/scaled by scroll */}
      <div
        ref={logoRef}
        className="fixed left-0 top-0 z-[55] opacity-0 transition-opacity duration-500 will-change-transform"
        style={{ transformOrigin: '0 0' }}
      >
        <Link href="/" onClick={onLogoClick} aria-label={`${STORE.name} home`} className="relative flex">
          <span className={morph ? 'logo-intro flex' : 'flex'}>
            <EcoLogo />
          </span>
          <span
            ref={tagRef}
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.24em] text-[#40916C]"
            style={{ opacity: morph ? 1 : 0 }}
          >
            {STORE.barangay} · {STORE.city}
          </span>
        </Link>
      </div>

      <header className="fixed inset-x-0 top-0 z-50" style={{ height: NAV_HEIGHT, pointerEvents: 'none' }}>
        <div
          ref={bgRef}
          className="absolute inset-0 border-b border-[#B7E4C7]/70 bg-[#FDFBF7]/85 backdrop-blur-md"
          style={{ opacity: morph ? 0 : 1 }}
        />

        <div
          ref={rightRef}
          className="relative mx-auto flex h-full max-w-6xl items-center justify-end gap-1 px-4 sm:px-7"
          style={{ opacity: morph ? 0 : 1, pointerEvents: morph ? 'none' : 'auto' }}
        >
          <nav className="hidden items-center md:flex" aria-label="Main">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`nav-link ${isActive(l.href) ? 'is-active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {onCartClick && (
            <button
              type="button"
              onClick={onCartClick}
              aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
              className="relative ml-1 grid h-10 w-10 place-items-center rounded-full text-[#1B4332] transition hover:bg-[#B7E4C7]/40"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 7h12l-1 13H7L6 7z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="badge-pop absolute -right-0.5 -top-0.5 grid h-5 place-items-center rounded-full bg-[#1B4332] px-1 text-[11px] font-bold text-white"
                  style={{ minWidth: 20 }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="ml-1 grid h-10 w-10 place-items-center rounded-full text-[#1B4332] transition hover:bg-[#B7E4C7]/40 md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div
            className="menu-drop absolute inset-x-3 top-full mt-1 rounded-2xl border border-[#B7E4C7]/70 bg-[#FDFBF7]/95 p-2 shadow-xl backdrop-blur-md md:hidden"
            style={{ pointerEvents: 'auto' }}
          >
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-base font-semibold transition hover:bg-[#B7E4C7]/40 ${
                  isActive(l.href) ? 'text-[#1B4332]' : 'text-[#1B4332]/75'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}