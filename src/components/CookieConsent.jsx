"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5EBE0] p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-gray-600 mb-4 sm:mb-0">
          We use cookies to improve your eco-shopping experience. By continuing, you agree to our{' '}
          <Link href="/privacy" className="text-[#1B4332] underline hover:text-opacity-80">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={acceptCookies} 
            className="bg-[#1B4332] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-opacity-90"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}