"use client";
import { useState, useRef } from 'react';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import EcoProductCard from '../../components/EcoProductCard';
import CartDrawer from '../../components/CartDrawer';
import CookieConsent from '../../components/CookieConsent';
import {
  Reveal,
  TiltCard,
  AnimatedHeading,
  FloatingLeaves,
  ScrollProgress,
} from '../../components/MotionKit';
import { ECO_PRODUCTS } from '../../lib/ecoProducts';

export default function ProductsPage() {
  // Demo mode: 3 fixed products from lib/ecoProducts.js (no database call)
  const products = ECO_PRODUCTS;
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const heroRef = useRef(null);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Hero spotlight follows the cursor (updates CSS vars, no re-render)
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
      <FloatingLeaves count={14} />
      <SiteNav cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div
          ref={heroRef}
          onPointerMove={onHeroMove}
          className="relative mb-14 overflow-hidden rounded-3xl border border-[#B7E4C7]/60 bg-white/50 px-6 py-14 text-center sm:px-12"
        >
          <div className="hero-spot pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <AnimatedHeading
              text="Sustainable Living, Delivered."
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            />
            <Reveal delay={700}>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                Recycled charcoal, handmade pots and woven rugs: three everyday essentials, made with the planet in mind.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 130}>
              <TiltCard className="h-full rounded-2xl bg-white">
                <EcoProductCard product={product} addToCart={addToCart} />
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          Demo products. Photos from Pexels; prices and descriptions are placeholders.
        </p>
      </main>

      <SiteFooter />

      <CartDrawer
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
      <CookieConsent />
    </div>
  );
}