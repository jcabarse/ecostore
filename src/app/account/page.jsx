"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return window.location.href = '/login';

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const { data: addressData } = await supabase.from('addresses').select('*').eq('user_id', user.id);
      
      setProfile(profileData);
      setAddresses(addressData || []);
    }
    loadData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await supabase.from('profiles').update({
      first_name: e.target.firstName.value,
      last_name: e.target.lastName.value,
      phone_number: e.target.phone.value
    }).eq('id', profile.id);
    alert('Profile updated');
  };

  if (!profile) return <div className="p-10 text-center animate-pulse">Loading Account...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 space-y-2">
        <h2 className="text-xl font-bold text-[#1B4332] mb-6">Hi, {profile.first_name || 'Eco Shopper'}</h2>
        {['profile', 'addresses', 'preferences', 'privacy'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`block w-full text-left px-4 py-2 rounded-md ${activeTab === tab ? 'bg-[#D8F3DC] text-[#1B4332] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </aside>

      <main className="flex-1 bg-white p-8 rounded-xl border border-[#F5EBE0]">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
            <h3 className="text-lg font-bold text-[#1B4332]">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="firstName" defaultValue={profile.first_name} placeholder="First Name (e.g., Jasley)" className="border p-2 rounded w-full" />
              <input name="lastName" defaultValue={profile.last_name} placeholder="Last Name (e.g., Cabarse)" className="border p-2 rounded w-full" />
            </div>
            <input name="phone" defaultValue={profile.phone_number} placeholder="Phone (+63...)" className="border p-2 rounded w-full" />
            <button type="submit" className="bg-[#1B4332] text-white px-6 py-2 rounded">Save Profile</button>
          </form>
        )}
        
        {activeTab === 'addresses' && (
          <div>
            <h3 className="text-lg font-bold text-[#1B4332] mb-4">Saved Addresses</h3>
            {addresses.map(addr => (
              <div key={addr.id} className="border p-4 rounded-md mb-4 flex justify-between">
                <div>
                  <p className="font-medium">{addr.street_address}</p>
                  <p className="text-sm text-gray-500">{addr.barangay}, {addr.city}</p>
                </div>
                {addr.is_default && <span className="text-xs bg-[#D8F3DC] text-[#1B4332] px-2 py-1 rounded">Default</span>}
              </div>
            ))}
            <button className="text-[#1B4332] border border-[#1B4332] px-4 py-2 rounded">+ Add New Address</button>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-red-600">Danger Zone</h3>
            <p className="text-sm text-gray-600">Download your data in JSON format, or permanently delete your account.</p>
            <div className="flex gap-4">
              <button className="border border-gray-300 px-4 py-2 rounded text-sm">Download My Data</button>
              <button className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">Delete Account</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}