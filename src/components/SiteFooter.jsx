import Link from 'next/link';
import EcoLogo from './EcoLogo';
import { STORE, fullAddress } from '../lib/storeInfo';

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[#B7E4C7]/70 bg-white/60 backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <EcoLogo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
            Plastic-free, eco-friendly essentials for everyday life, from {STORE.barangay}, {STORE.city}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#40916C]">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-[#1B4332]">
            <li><Link className="hover:underline" href="/">Home</Link></li>
            <li><Link className="hover:underline" href="/#about">About</Link></li>
            <li><Link className="hover:underline" href="/#visit">Visit us</Link></li>
            <li><Link className="hover:underline" href="/products">Products</Link></li>
            <li><Link className="hover:underline" href="/privacy">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#40916C]">Find us</h3>
          <address className="mt-4 text-sm not-italic leading-relaxed text-gray-600">
            {fullAddress}
          </address>
          {STORE.phone && <p className="mt-2 text-sm text-gray-600">{STORE.phone}</p>}
          {STORE.email && <p className="mt-1 text-sm text-gray-600">{STORE.email}</p>}
          {STORE.facebook && (
            <a className="mt-2 inline-block text-sm font-semibold text-[#1B4332] hover:underline" href={STORE.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-[#B7E4C7]/50 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {STORE.name} · {STORE.barangay}, {STORE.city}, {STORE.province}
      </div>
    </footer>
  );
}