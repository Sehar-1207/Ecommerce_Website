"use client";

import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, LogOut, ChevronRight, Edit3 } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  joined: string;
}

interface Order {
  id: string;
  date: string;
  total: string;
  status: string;
  item: string;
}

interface Address {
  id: number;
  type: string;
  street: string;
  city: string;
  name: string;
}

type TabType = 'profile' | 'orders' | 'addresses';

const FALLBACK_PROFILE: ProfileData = {
  name: "Guest User",
  email: "guest@example.com",
  phone: "+1 (555) 000-0000",
  joined: "Guest Session"
};

const ORDERS: Order[] = [
  { id: "HK-9082", date: "Jan 12, 2026", total: "$124.00", status: "Delivered", item: "Ceramic Matte Dinnerware Set" },
  { id: "HK-8421", date: "Nov 28, 2025", total: "$89.50", status: "Delivered", item: "Organic Linen Napkins & Oak Salt Mill" },
];

const ADDRESSES: Address[] = [
  { id: 1, type: "Default Shipping", street: "742 Evergreen Terrace", city: "Springfield, OR 97477", name: "Sarah Jenkins" },
  { id: 2, type: "Billing Address", street: "120 Oakwood Lane, Apt 4B", city: "Portland, OR 97201", name: "Sarah Jenkins" }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>(FALLBACK_PROFILE);

  // Sync state safely on client side
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setProfileData(JSON.parse(storedUser));
    }
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('currentUser', JSON.stringify(profileData));
    setIsEditing(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    setProfileData(FALLBACK_PROFILE);
    window.location.reload();
  };

  return (
    <main className="min-h-screen w-full bg-[#fafaf9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1c2a21]">
      <div className="mx-auto max-w-6xl">
        
        <header className="mb-8 sm:mb-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">My Account</h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#5c6b60]">
            Manage your orders, personal details, and shipping preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          
          <aside className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-2 scrollbar-none border-b border-[#e2e8e2] lg:border-0">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex-shrink-0 flex items-center space-x-2.5 sm:space-x-3 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'profile' 
                  ? "bg-[#2d4a36] text-white shadow-sm" 
                  : "hover:bg-[#e2e8e2]/40 text-[#5c6b60] hover:text-[#1c2a21]"
              }`}
            >
              <User className="h-4 w-4 stroke-[2]" />
              <span>Personal Details</span>
            </button>


            <hr className="hidden lg:block border-[#e2e8e2] my-4" />

            <button 
              onClick={handleSignOut}
              className="flex-shrink-0 flex items-center space-x-2.5 sm:space-x-3 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-all ml-auto lg:ml-0"
            >
              <LogOut className="h-4 w-4 stroke-[2]" />
              <span>Sign Out</span>
            </button>
          </aside>

          <section className="lg:col-span-3 bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-8 shadow-sm">
            
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#e2e8e2]">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">Personal Profile</h2>
                    <p className="text-[11px] sm:text-xs text-[#5c6b60] mt-0.5">{profileData.joined}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-[#2d4a36] hover:opacity-80 transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">Full Name</label>
                        <input 
                          type="text" 
                          value={profileData.name} 
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          value={profileData.email} 
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-sm transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">Phone Number</label>
                      <input 
                        type="text" 
                        value={profileData.phone} 
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-sm transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full sm:w-auto rounded-xl bg-[#2d4a36] px-5 py-2.5 text-xs font-medium text-white hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60]">Full Name</span>
                      <p className="text-sm font-medium">{profileData.name}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60]">Email Address</span>
                      <p className="text-sm font-medium">{profileData.email}</p>
                    </div>
                    <div className="space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60]">Phone Number</span>
                      <p className="text-sm font-medium">{profileData.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders and Addresses views remain identical for structural responsiveness */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#e2e8e2]">
                  <h2 className="text-lg sm:text-xl font-semibold">Order History</h2>
                  <p className="text-[11px] sm:text-xs text-[#5c6b60] mt-0.5">Track your past purchases and delivery statuses.</p>
                </div>
                <div className="space-y-4">
                  {ORDERS.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[#e2e8e2] hover:bg-[#fafaf9]/50 transition-all gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1c2a21]">{order.id}</span>
                          <span className="inline-flex items-center rounded-full bg-[#2d4a36]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#2d4a36]">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#5c6b60]">{order.item}</p>
                        <p className="text-[10px] sm:text-[11px] text-[#5c6b60]/75">{order.date}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end sm:gap-6 border-t sm:border-0 border-[#e2e8e2] pt-3 sm:pt-0">
                        <span className="text-sm font-semibold text-[#1c2a21]">{order.total}</span>
                        <button className="flex items-center space-x-1 text-xs font-semibold text-[#2d4a36] hover:underline">
                          <span>Details</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#e2e8e2]">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">Saved Addresses</h2>
                    <p className="text-[11px] sm:text-xs text-[#5c6b60] mt-0.5">Manage details for your default shipping options.</p>
                  </div>
                  <button className="text-xs font-semibold text-[#2d4a36] hover:opacity-80 transition-all">
                    + Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ADDRESSES.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-xl border border-[#e2e8e2] bg-[#fafaf9]/30 flex flex-col justify-between min-h-36">
                      <div className="space-y-1.5">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#2d4a36]">{addr.type}</span>
                        <h4 className="text-sm font-semibold">{addr.name}</h4>
                        <p className="text-xs text-[#5c6b60] leading-relaxed">{addr.street}<br />{addr.city}</p>
                      </div>
                      <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-[#e2e8e2]">
                        <button className="text-xs font-semibold text-[#5c6b60] hover:text-[#1c2a21] transition-all">Edit</button>
                        <span className="text-[#e2e8e2] text-xs">|</span>
                        <button className="text-xs font-semibold text-[#5c6b60] hover:text-[#1c2a21] transition-all">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </section>

        </div>
      </div>
    </main>
  );
}