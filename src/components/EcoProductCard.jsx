"use client";
import { useState } from 'react';

// Exchange rate: how many pesos equal 1 US dollar (edit this one number)
const PHP_PER_USD = 64.5;

// Converts a peso amount to a formatted USD price (local to this card only)
const formatUSD = (php) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(php / PHP_PER_USD);

// Self-contained product card for the demo products.
// If the photo can't load, a green placeholder with an emoji shows instead.
export default function EcoProductCard({ product, addToCart }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const onAdd = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#B7E4C7] to-[#52B788]">
        {!imgFailed ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-6xl" aria-hidden="true">
            {product.emoji}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[#FDFBF7]/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1B4332] backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold text-[#40916C]">♻ {product.badge}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug text-[#1B4332]">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{product.description}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xl font-extrabold text-[#1B4332]">{formatUSD(product.price)}</span>
          <button
            type="button"
            onClick={onAdd}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-[#FDFBF7] transition hover:-translate-y-0.5 active:scale-95 ${
              justAdded ? 'bg-[#40916C]' : 'bg-[#1B4332] hover:bg-[#2D6A4F]'
            }`}
          >
            {justAdded ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
