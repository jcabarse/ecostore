"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { formatPeso } from '../../lib/ecoProducts';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'orders', label: 'My Orders' },
  { id: 'privacy', label: 'Privacy' },
];

const addressToText = (a) =>
  [a.street_address, a.barangay, a.city, a.province].filter(Boolean).join(', ');

const inputClass = 'border border-gray-300 p-2 rounded w-full';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null); // null = show the list, object = show the form
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  const loadAll = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setUser(user);

    const [p, a, o] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }),
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);
    setProfile(p.data || { id: user.id });
    setAddresses(a.data || []);
    setOrders(o.data || []);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const f = e.target;
    const first = f.firstName.value.trim();
    const last = f.lastName.value.trim();
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      first_name: first,
      last_name: last,
      phone_number: f.phone.value.trim(),
      display_name: `${first} ${last}`.trim(),
    });
    if (error) return flash('Could not save: ' + error.message);
    await loadAll();
    flash('Profile updated');
  };

  // ----- Address book -----
  const startNewAddress = () =>
    setEditing({
      label: 'Home',
      recipient_name:
        profile?.display_name || [profile?.first_name, profile?.last_name].filter(Boolean).join(' '),
      phone_number: profile?.phone_number || '',
      street_address: '',
      barangay: '',
      city: '',
      province: '',
      is_default: addresses.length === 0,
    });

  const setField = (name) => (e) =>
    setEditing((prev) => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const saveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    const a = editing;
    const payload = {
      user_id: user.id,
      label: a.label,
      recipient_name: a.recipient_name,
      phone_number: a.phone_number,
      street_address: a.street_address,
      barangay: a.barangay,
      city: a.city,
      province: a.province,
      is_default: a.is_default || addresses.length === 0,
    };

    // Only one default address per user
    if (payload.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    }

    const { error } = a.id
      ? await supabase.from('addresses').update(payload).eq('id', a.id)
      : await supabase.from('addresses').insert(payload);

    setSaving(false);
    if (error) return flash('Could not save address: ' + error.message);
    setEditing(null);
    await loadAll();
    flash('Address saved');
  };

  const makeDefault = async (id) => {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    await loadAll();
  };

  const deleteAddress = async (addr) => {
    if (!window.confirm('Delete this address?')) return;
    await supabase.from('addresses').delete().eq('id', addr.id);
    const remaining = addresses.filter((x) => x.id !== addr.id);
    if (addr.is_default && remaining.length > 0) {
      await supabase.from('addresses').update({ is_default: true }).eq('id', remaining[0].id);
    }
    await loadAll();
  };

  // ----- Privacy -----
  const downloadData = () => {
    const blob = new Blob(
      [JSON.stringify({ account: { id: user.id, email: user.email }, profile, addresses, orders }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-ecostore-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (!user || !profile) return <div className="p-10 text-center animate-pulse">Loading Account...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      <SiteNav />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-16 pt-28 md:flex-row">
        <aside className="w-full md:w-64 space-y-2">
          <h2 className="text-xl font-bold text-[#1B4332] mb-6">Hi, {profile.first_name || 'Eco Shopper'}</h2>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setEditing(null); }}
              className={`block w-full text-left px-4 py-2 rounded-md ${activeTab === tab.id ? 'bg-[#D8F3DC] text-[#1B4332] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
          <button onClick={logout} className="block w-full text-left px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50">
            Log out
          </button>
        </aside>

        <main className="flex-1 bg-white p-8 rounded-xl border border-[#F5EBE0]">
          {message && <div className="mb-4 rounded bg-[#E9F5EE] p-3 text-sm text-[#1B4332]">{message}</div>}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
              <h3 className="text-lg font-bold text-[#1B4332]">Personal Details</h3>
              <p className="text-sm text-gray-500">Email: {user.email}</p>
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" defaultValue={profile.first_name || ''} placeholder="First Name" className={inputClass} />
                <input name="lastName" defaultValue={profile.last_name || ''} placeholder="Last Name" className={inputClass} />
              </div>
              <input name="phone" defaultValue={profile.phone_number || ''} placeholder="Phone (+63...)" className={inputClass} />
              <button type="submit" className="bg-[#1B4332] text-white px-6 py-2 rounded">Save Profile</button>
            </form>
          )}

          {activeTab === 'addresses' && !editing && (
            <div>
              <h3 className="text-lg font-bold text-[#1B4332] mb-4">Saved Addresses</h3>
              {addresses.length === 0 && <p className="mb-4 text-sm text-gray-500">No saved addresses yet. Add one and checkout will fill it in for you.</p>}
              {addresses.map((addr) => (
                <div key={addr.id} className="border p-4 rounded-md mb-4 flex justify-between gap-4">
                  <div className="text-sm">
                    <p className="font-medium">
                      {addr.label || 'Address'}
                      {addr.is_default && <span className="ml-2 text-xs bg-[#D8F3DC] text-[#1B4332] px-2 py-1 rounded">Default</span>}
                    </p>
                    {(addr.recipient_name || addr.phone_number) && (
                      <p className="text-gray-700">{[addr.recipient_name, addr.phone_number].filter(Boolean).join(' · ')}</p>
                    )}
                    <p className="text-gray-500">{addressToText(addr)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 text-sm">
                    <button onClick={() => setEditing(addr)} className="text-[#1B4332] underline">Edit</button>
                    {!addr.is_default && <button onClick={() => makeDefault(addr.id)} className="text-[#1B4332] underline">Set as default</button>}
                    <button onClick={() => deleteAddress(addr)} className="text-red-600">Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={startNewAddress} className="text-[#1B4332] border border-[#1B4332] px-4 py-2 rounded">+ Add New Address</button>
            </div>
          )}

          {activeTab === 'addresses' && editing && (
            <form onSubmit={saveAddress} className="space-y-4 max-w-md">
              <h3 className="text-lg font-bold text-[#1B4332]">{editing.id ? 'Edit Address' : 'New Address'}</h3>
              <select value={editing.label || 'Home'} onChange={setField('label')} className={`${inputClass} bg-white`}>
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
              <input required value={editing.recipient_name || ''} onChange={setField('recipient_name')} placeholder="Recipient name" className={inputClass} />
              <input required value={editing.phone_number || ''} onChange={setField('phone_number')} placeholder="Phone (+63...)" className={inputClass} />
              <input required value={editing.street_address || ''} onChange={setField('street_address')} placeholder="Street, house or building no." className={inputClass} />
              <input value={editing.barangay || ''} onChange={setField('barangay')} placeholder="Barangay (e.g., Brgy. Ipil)" className={inputClass} />
              <div className="grid grid-cols-2 gap-4">
                <input required value={editing.city || ''} onChange={setField('city')} placeholder="City" className={inputClass} />
                <input value={editing.province || ''} onChange={setField('province')} placeholder="Province" className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={!!editing.is_default} onChange={setField('is_default')} />
                Set as my default address
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="bg-[#1B4332] text-white px-6 py-2 rounded disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="border px-6 py-2 rounded">Cancel</button>
              </div>
            </form>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-bold text-[#1B4332] mb-4">My Orders</h3>
              {orders.length === 0 && <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>}
              {orders.map((o) => (
                <div key={o.id} className="border rounded-md p-4 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-gray-500">Order {String(o.id).slice(0, 8)}</p>
                    <span className="rounded bg-[#E9F5EE] px-2 py-1 text-xs font-semibold capitalize text-[#1B4332]">{o.status}</span>
                  </div>
                  {o.created_at && (
                    <p className="text-gray-500">
                      {new Date(o.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  )}
                  <ul className="my-3 space-y-1">
                    {(o.items || []).map((i) => (
                      <li key={i.id} className="flex justify-between">
                        <span>{i.name} × {i.quantity}</span>
                        <span>{formatPeso(i.price * i.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500">Deliver to: {o.delivery_address}</p>
                  <p className="mt-2 text-right font-bold text-[#1B4332]">Total: {formatPeso(o.total_amount)}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
              <p className="text-sm text-gray-600">Download your data in JSON format, or permanently delete your account.</p>
              <div className="flex gap-4">
                <button onClick={downloadData} className="border border-gray-300 px-4 py-2 rounded text-sm">Download My Data</button>
                <button className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">Delete Account</button>
              </div>
            </div>
          )}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
