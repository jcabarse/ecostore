"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Map to prevent Next.js SSR crashes
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

// Exchange rate: how many pesos equal 1 US dollar (keep the same as the card and cart)
const PHP_PER_USD = 64.5;

// Flat delivery fee in US dollars (same $5.00 as before)
const DELIVERY_USD = 5.0;

const formatUSD = (usd) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd);

export default function CheckoutFlow({ cartItems }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('delivery');
  const [pin, setPin] = useState({ lat: 11.005, lng: 124.608 }); // Default to Ormoc area

  // Cart prices are stored in pesos, so convert to USD first, then add delivery
  const subtotalPeso = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotalUsd = subtotalPeso / PHP_PER_USD;
  const totalUsd = subtotalUsd + DELIVERY_USD;

  const handleGeolocate = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      {/* Step Indicators */}
      <div className="flex justify-between mb-8 border-b pb-4 text-sm font-medium">
        <span className={step >= 1 ? "text-[#1B4332]" : "text-gray-400"}>1. Contact</span>
        <span className={step >= 2 ? "text-[#1B4332]" : "text-gray-400"}>2. Fulfillment</span>
        <span className={step >= 3 ? "text-[#1B4332]" : "text-gray-400"}>3. Payment</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Contact Details</h2>
          <input placeholder="Email" className="w-full border p-2 rounded" />
          <input placeholder="Full Name" className="w-full border p-2 rounded" />
          <button onClick={() => setStep(2)} className="bg-[#1B4332] text-white px-6 py-2 rounded">Next: Shipping</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Delivery Location</h2>
          <textarea placeholder="Complete Address (e.g., Brgy. Ipil, Ormoc City, Leyte)" className="w-full border p-2 rounded h-20 resize-none" />
          
          <div className="h-64 rounded-xl overflow-hidden border">
            <MapContainer center={[pin.lat, pin.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
              <Marker position={[pin.lat, pin.lng]} draggable={true} eventHandlers={{ dragend: (e) => setPin(e.target.getLatLng()) }} />
            </MapContainer>
          </div>
          
          <button onClick={handleGeolocate} className="text-sm text-[#1B4332] underline">Use my current location</button>
          
          <div className="pt-4">
            <button onClick={() => setStep(3)} className="bg-[#1B4332] text-white w-full py-3 rounded font-bold">Proceed to Review</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Review & Pay</h2>
          <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
            <div className="flex justify-between"><span>Subtotal:</span> <span>{formatUSD(subtotalUsd)}</span></div>
            <div className="flex justify-between"><span>Delivery:</span> <span>{formatUSD(DELIVERY_USD)}</span></div>
            <div className="flex justify-between font-bold border-t pt-2 text-lg">
              <span>Total:</span> <span>{formatUSD(totalUsd)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">You will be charged {formatUSD(totalUsd)} USD.</p>
          <button className="bg-[#1B4332] text-white w-full py-3 rounded font-bold">Pay Now (Gateway Demo)</button>
        </div>
      )}
    </div>
  );
}
