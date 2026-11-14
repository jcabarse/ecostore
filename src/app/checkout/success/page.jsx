"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

// 1. We move the logic into a separate child component
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm text-center border border-[#F5EBE0]">
      <div className="text-4xl mb-4">🌱</div>
      <h1 className="text-2xl font-bold text-[#1B4332] mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 mb-6">Thank you for your eco-friendly purchase. Your receipt has been emailed.</p>
      
      {orderId && (
        <p className="text-sm bg-gray-50 text-gray-700 p-3 rounded-md mb-6 font-mono">
          Order ID: {orderId}
        </p>
      )}
      
      <Link href="/" className="bg-[#1B4332] text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors inline-block">
        Continue Shopping
      </Link>
    </div>
  );
}

// 2. We wrap that child in a Suspense boundary in the main page export
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] px-6">
      <Suspense fallback={<div className="mt-20 text-center text-gray-500 animate-pulse">Loading your order details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}