"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { formatPeso, DELIVERY_FEE } from '../lib/ecoProducts';

// Dynamically import Map to prevent Next.js SSR crashes
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

const addressToText = (a) =>
  [a.street_address, a.barangay, a.city, a.province].filter(Boolean).join(', ');

export default function CheckoutFlow({ cartItems }) {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  // Contact details (prefilled from the account when logged in)
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Address: a saved one (selectedId = its id) or a new one ('new')
  const [selectedId, setSelectedId] = useState('new');
  const [addressText, setAddressText] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);
  const [pin, setPin] = useState({ lat: 11.005, lng: 124.608 }); // Default to Ormoc area

  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + DELIVERY_FEE;

  function pickSaved(a) {
    setSelectedId(a.id);
    setAddressText(addressToText(a));
    if (a.latitude && a.longitude) setPin({ lat: a.latitude, lng: a.longitude });
  }

  function pickNew() {
    setSelectedId('new');
    setAddressText('');
  }

  // Load the logged-in user's saved details
  useEffect(() => {
    let active = true;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) return;
      setUser(user);
      setEmail(user.email || '');

      const [p, a] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }),
      ]);
      if (!active) return;

      const prof = p.data;
      if (prof) {
        setFullName(prof.display_name || [prof.first_name, prof.last_name].filter(Boolean).join(' '));
        setPhone(prof.phone_number || '');
      }
      const list = a.data || [];
      setAddresses(list);
      const preferred = list.find((x) => x.is_default) || list[0];
      if (preferred) pickSaved(preferred);
    }
    load();
    return () => { active = false; };
  }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setPin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  const goToStep2 = () => {
    if (!email.trim() || !fullName.trim() || !phone.trim()) {
      setError('Please fill in your email, full name and phone number.');
      return;
    }
    setError('');
    setStep(2);
  };

  const goToStep3 = () => {
    if (!addressText.trim()) {
      setError('Please enter your delivery address.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handlePay = async () => {
    setPaying(true);
    setError('');
    try {
      // Save a newly typed address to the account if the shopper asked for it
      if (user && selectedId === 'new' && saveAddress) {
        await supabase.from('addresses').insert({
          user_id: user.id,
          label: 'Home',
          recipient_name: fullName,
          phone_number: phone,
          street_address: addressText.trim(),
          latitude: pin.lat,
          longitude: pin.lng,
          is_default: addresses.length === 0,
        });
      }

      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          cartItems: cartItems.map((i) => ({ id: i.id, quantity: i.quantity })),
          deliveryMethod: 'delivery',
          address: addressText.trim(),
          contact: { name: fullName.trim(), email: email.trim(), phone: phone.trim() },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed. Please try again.');

      // Internal success page = demo mode with no payment link, so the cart is done
      if (data.url.startsWith('/')) localStorage.removeItem('eco_cart');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setPaying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      {/* Step Indicators */}
      <div className="flex justify-between mb-8 border-b pb-4 text-sm font-medium">
        <span className={step >= 1 ? "text-[#1B4332]" : "text-gray-400"}>1. Contact</span>
        <span className={step >= 2 ? "text-[#1B4332]" : "text-gray-400"}>2. Fulfillment</span>
        <span className={step >= 3 ? "text-[#1B4332]" : "text-gray-400"}>3. Payment</span>
      </div>

      {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Contact Details</h2>
          {user ? (
            <p className="rounded bg-[#E9F5EE] p-3 text-sm text-[#1B4332]">
              Signed in as <strong>{user.email}</strong>. Your saved details are filled in below.
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Have an account?{' '}
              <Link href="/login?next=/checkout" className="font-semibold text-[#1B4332] underline">
                Log in
              </Link>{' '}
              to use your saved details, or continue as a guest.
            </p>
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full border p-2 rounded" />
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full border p-2 rounded" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone (+63...)" className="w-full border p-2 rounded" />
          <button onClick={goToStep2} className="bg-[#1B4332] text-white px-6 py-2 rounded">Next: Shipping</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Delivery Location</h2>

          {user && addresses.length > 0 && (
            <div className="space-y-2">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${selectedId === a.id ? 'border-[#1B4332] bg-[#E9F5EE]' : 'border-gray-200'}`}
                >
                  <input type="radio" name="address" checked={selectedId === a.id} onChange={() => pickSaved(a)} className="mt-1" />
                  <span className="text-sm">
                    <span className="font-semibold">{a.label || 'Address'}</span>
                    {a.is_default && <span className="ml-2 rounded bg-[#D8F3DC] px-2 py-0.5 text-xs text-[#1B4332]">Default</span>}
                    <span className="block text-gray-600">{addressToText(a)}</span>
                  </span>
                </label>
              ))}
              <label
                className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${selectedId === 'new' ? 'border-[#1B4332] bg-[#E9F5EE]' : 'border-gray-200'}`}
              >
                <input type="radio" name="address" checked={selectedId === 'new'} onChange={pickNew} className="mt-1" />
                <span className="text-sm font-semibold">Use a different address</span>
              </label>
            </div>
          )}

          {selectedId === 'new' && (
            <>
              <textarea
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                placeholder="Complete Address (e.g., Brgy. Ipil, Ormoc City, Leyte)"
                className="w-full border p-2 rounded h-20 resize-none"
              />

              <div className="h-64 rounded-xl overflow-hidden border">
                <MapContainer center={[pin.lat, pin.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                  <Marker position={[pin.lat, pin.lng]} draggable={true} eventHandlers={{ dragend: (e) => setPin(e.target.getLatLng()) }} />
                </MapContainer>
              </div>

              <button onClick={handleGeolocate} className="text-sm text-[#1B4332] underline">Use my current location</button>

              {user && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                  Save this address to my account
                </label>
              )}
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={() => { setError(''); setStep(1); }} className="rounded border px-5 py-3 font-semibold text-[#1B4332]">Back</button>
            <button onClick={goToStep3} className="bg-[#1B4332] text-white flex-1 py-3 rounded font-bold">Proceed to Review</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Review & Pay</h2>

          <div className="space-y-1 rounded border p-4 text-sm">
            <p><span className="text-gray-500">Contact:</span> {fullName} · {phone}</p>
            <p><span className="text-gray-500">Email:</span> {email}</p>
            <p><span className="text-gray-500">Deliver to:</span> {addressText}</p>
            <button onClick={() => { setError(''); setStep(1); }} className="pt-1 text-[#1B4332] underline">Change details</button>
          </div>

          <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
            <div className="flex justify-between"><span>Subtotal:</span> <span>{formatPeso(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery:</span> <span>{formatPeso(DELIVERY_FEE)}</span></div>
            <div className="flex justify-between font-bold border-t pt-2 text-lg">
              <span>Total:</span> <span>{formatPeso(total)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">You will be charged {formatPeso(total)}.</p>
          <button
            onClick={handlePay}
            disabled={paying}
            className="bg-[#1B4332] text-white w-full py-3 rounded font-bold disabled:opacity-60"
          >
            {paying ? 'Placing your order...' : 'Pay Now (Gateway Demo)'}
          </button>
        </div>
      )}
    </div>
  );
}
