"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CheckoutFlow from '../../components/CheckoutFlow';

// Exchange rate: how many pesos equal 1 US dollar (keep the same as the card and cart)
const PHP_PER_USD = 64.5;

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    // Retrieve the cart data we saved in the drawer
    const savedCart = localStorage.getItem('eco_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  }, []);

  if (!cart) return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
  
  if (cart.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#FDFBF7]">
      <p className="text-gray-500">Your cart is empty.</p>
      <Link href="/" className="text-[#1B4332] font-medium underline">Return to Store</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <Link href="/" className="text-[#1B4332] font-medium hover:underline">&larr; Back to Cart</Link>
      </div>
      
      {/* Prices are stored in pesos, so we show USD using 1 / PHP_PER_USD */}
      <CheckoutFlow 
        cartItems={cart} 
        displayCurrency="USD" 
        exchangeRate={1 / PHP_PER_USD} 
      />
    </div>
  );
}
