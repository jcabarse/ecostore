"use client";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6 text-center font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#F5EBE0] max-w-lg w-full">
        <div className="w-16 h-16 bg-[#D8F3DC] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#1B4332]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#1B4332] mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">Thank you for shopping sustainably. Your eco-friendly products are being prepared.</p>
        
        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500 mb-8 font-mono break-all">
            Order ID: {orderId}
          </div>
        )}

        <Link href="/" className="inline-block bg-[#1B4332] text-white px-8 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors">
          Return to Store
        </Link>
      </div>
    </div>
  );
}