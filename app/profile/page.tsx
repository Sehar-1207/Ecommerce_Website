"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Package, MapPin, LogOut, Edit3, ShoppingBag, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  total: string;
  status: string;
  item: string;
}

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  name: string;
}

type TabType = 'profile' | 'orders' | 'addresses';

const FALLBACK_PROFILE: ProfileData = {
  id: "guest",
  name: "Guest User",
  email: "guest@example.com",
  phone: "",
  joined: "Guest Session"
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  
  const [currentUser, setCurrentUser] = useState<ProfileData>(FALLBACK_PROFILE);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [addressForm, setAddressForm] = useState({
    type: "Shipping Address",
    name: "",
    street: "",
    city: ""
  });

  const loadUserData = () => {
    const storedUserRaw = localStorage.getItem('currentUser');
    if (!storedUserRaw) {
      router.push('/');
      return;
    }

    try {
      const user: ProfileData = JSON.parse(storedUserRaw);
      
      if (!user.id || user.id.trim() === "" || user.id === "guest") {
        if (user.email && user.email !== "guest@example.com") {
          user.id = `user_${Math.random().toString(36).substring(2, 9)}`;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }
      
      setCurrentUser(user);

      const userOrdersKey = `orders_${user.id}`;
      const storedOrders = localStorage.getItem(userOrdersKey);
      setOrders(storedOrders ? JSON.parse(storedOrders) : []);
      
      const userAddressesKey = `addresses_${user.id}`;
      const storedAddresses = localStorage.getItem(userAddressesKey);
      setAddresses(storedAddresses ? JSON.parse(storedAddresses) : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleLocalUpdate = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleLocalUpdate);
    window.addEventListener('userStateChanged', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleLocalUpdate);
      window.removeEventListener('userStateChanged', handleLocalUpdate);
    };
  }, []);

  const handleCancelEditProfile = () => {
    loadUserData();
    setIsEditing(false);
  };

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("userStateChanged"));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleStartEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setIsAddingAddress(false);
    setAddressForm({
      type: addr.type,
      name: addr.name,
      street: addr.street,
      city: addr.city
    });
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = currentUser.id;
    
    const newAddress: Address = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      type: addressForm.type,
      name: addressForm.name,
      street: addressForm.street,
      city: addressForm.city
    };

    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem(`addresses_${userId}`, JSON.stringify(updated));
    
    setIsAddingAddress(false);
    setAddressForm({ type: "Shipping Address", name: "", street: "", city: "" });
    toast.success("Address added successfully!");
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = currentUser.id;
    
    const updated = addresses.map(addr => {
      if (addr.id === editingAddressId) {
        return {
          ...addr,
          type: addressForm.type,
          name: addressForm.name,
          street: addressForm.street,
          city: addressForm.city
        };
      }
      return addr;
    });

    setAddresses(updated);
    localStorage.setItem(`addresses_${userId}`, JSON.stringify(updated));
    setEditingAddressId(null);
    toast.success("Address updated successfully!");
  };

  const handleRemoveAddress = (id: string) => {
    const userId = currentUser.id;
    const updated = addresses.filter(addr => addr.id !== id);
    setAddresses(updated);
    localStorage.setItem(`addresses_${userId}`, JSON.stringify(updated));
    toast.error("Address removed.");
  };

  const handleSignOut = () => {
    toast.success("Signed out successfully. See you soon!");

    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("userStateChanged"));
    
    router.push('/');
  };

  return (
    <main className="min-h-screen w-full bg-[#fafaf9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1c2a21]">
      <div className="mx-auto max-w-6xl">
        
        <header className="mb-8 sm:mb-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">My Account</h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#5c6b60]">
            Manage your personal details, order history, and address books.
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

            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex-shrink-0 flex items-center space-x-2.5 sm:space-x-3 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'orders' 
                  ? "bg-[#2d4a36] text-white shadow-sm" 
                  : "hover:bg-[#e2e8e2]/40 text-[#5c6b60] hover:text-[#1c2a21]"
              }`}
            >
              <Package className="h-4 w-4 stroke-[2]" />
              <span>Orders</span>
            </button>

            <button 
              onClick={() => setActiveTab('addresses')}
              className={`flex-shrink-0 flex items-center space-x-2.5 sm:space-x-3 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'addresses' 
                  ? "bg-[#2d4a36] text-white shadow-sm" 
                  : "hover:bg-[#e2e8e2]/40 text-[#5c6b60] hover:text-[#1c2a21]"
              }`}
            >
              <MapPin className="h-4 w-4 stroke-[2]" />
              <span>Addresses</span>
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
                  <div className="flex items-center space-x-4">
                    <div className="relative h-14 w-14 rounded-full bg-[#e8ece8] flex items-center justify-center text-[#2d4a36] overflow-hidden border border-[#e2e8e2] flex-shrink-0">
                      {currentUser.image ? (
                        <Image 
                          src={currentUser.image} 
                          alt={currentUser.name} 
                          fill 
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 stroke-[1.5]" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold">{currentUser.name || "Personal Profile"}</h2>
                      <p className="text-[11px] sm:text-xs text-[#5c6b60] mt-0.5">{currentUser.joined || 'Member'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => isEditing ? handleCancelEditProfile() : setIsEditing(true)}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-[#2d4a36] hover:opacity-80 transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">Full Name</label>
                        <input 
                          type="text" 
                          value={currentUser.name} 
                          onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-sm transition-all bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          value={currentUser.email} 
                          onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-sm transition-all bg-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60] mb-1.5">Phone Number</label>
                      <input 
                        type="text" 
                        value={currentUser.phone} 
                        onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-[#e2e8e2] focus:ring-1 focus:ring-[#2d4a36] focus:border-[#2d4a36] outline-none text-sm transition-all bg-white"
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
                      <p className="text-sm font-medium">{currentUser.name || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60]">Email Address</span>
                      <p className="text-sm font-medium">{currentUser.email}</p>
                    </div>
                    <div className="space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#5c6b60]">Phone Number</span>
                      <p className="text-sm font-medium">{currentUser.phone || "No phone number linked"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#e2e8e2]">
                  <h2 className="text-lg sm:text-xl font-semibold">Order History</h2>
                  <p className="text-[11px] sm:text-xs text-[#5c6b60] mt-0.5">Track your past purchases and delivery statuses.</p>
                </div>
                
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-[#2d4a36]/5 flex items-center justify-center text-[#2d4a36] mb-4">
                      <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1c2a21]">No orders placed yet</h3>
                    <p className="mt-1 text-xs text-[#5c6b60] max-w-xs">
                      Explore our beautiful range of functional essentials and find your perfect setups.
                    </p>
                    <button 
                      onClick={() => router.push('/')} 
                      className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#2d4a36] px-4 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all"
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
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
                        <div className="text-right">
                          <span className="text-sm font-bold">{order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#e2e8e2]">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">Saved Addresses</h2>
                    <p className="text-[11px] sm:text-xs text-[#5c6b60] mt-0.5">Manage details for your default shipping options.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsAddingAddress(!isAddingAddress);
                      setEditingAddressId(null);
                      setAddressForm({ type: "Shipping Address", name: "", street: "", city: "" });
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#e2e8e2] text-xs font-semibold hover:bg-[#fafaf9] transition-all"
                  >
                    {isAddingAddress ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    <span>{isAddingAddress ? "Cancel" : "Add New"}</span>
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleCreateAddress} className="p-4 rounded-xl border border-[#2d4a36]/30 bg-[#2d4a36]/5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d4a36]">New Shipping Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        required
                        value={addressForm.name} 
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        placeholder="Receiver's Name"
                        className="w-full px-3 py-2 rounded-lg border border-[#e2e8e2] outline-none text-xs bg-white focus:border-[#2d4a36]"
                      />
                      <select
                        value={addressForm.type}
                        onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#e2e8e2] outline-none text-xs bg-white focus:border-[#2d4a36]"
                      >
                        <option value="Shipping Address">Shipping Address</option>
                        <option value="Billing Address">Billing Address</option>
                        <option value="Home Address">Home Address</option>
                        <option value="Office Address">Office Address</option>
                      </select>
                    </div>
                    <input 
                      type="text" 
                      required
                      value={addressForm.street} 
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      placeholder="Street Address, P.O. Box"
                      className="w-full px-3 py-2 rounded-lg border border-[#e2e8e2] outline-none text-xs bg-white focus:border-[#2d4a36]"
                    />
                    <input 
                      type="text" 
                      required
                      value={addressForm.city} 
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="City, State, ZIP Code"
                      className="w-full px-3 py-2 rounded-lg border border-[#e2e8e2] outline-none text-xs bg-white focus:border-[#2d4a36]"
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 rounded-lg bg-[#2d4a36] text-white font-medium text-xs hover:opacity-90"
                    >
                      Save Address
                    </button>
                  </form>
                )}

                {addresses.length === 0 && !isAddingAddress ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-[#2d4a36]/5 flex items-center justify-center text-[#2d4a36] mb-4">
                      <MapPin className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#1c2a21]">No saved addresses</h3>
                    <p className="mt-1 text-xs text-[#5c6b60] max-w-xs">
                      Your default address book is empty. Add one above or checkout to automatically register your details.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="p-4 rounded-xl border border-[#e2e8e2] bg-[#fafaf9]/30 flex flex-col justify-between min-h-36">
                        {editingAddressId === addr.id ? (
                          <form onSubmit={handleSaveAddress} className="space-y-3 w-full">
                            <div className="flex items-center justify-between border-b border-[#e2e8e2] pb-1.5 mb-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#2d4a36]">Editing address</span>
                              <button 
                                type="button" 
                                onClick={() => setEditingAddressId(null)}
                                className="text-zinc-400 hover:text-zinc-950"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <select
                              value={addressForm.type}
                              onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#e2e8e2] outline-none text-xs bg-white focus:border-[#2d4a36]"
                            >
                              <option value="Shipping Address">Shipping Address</option>
                              <option value="Billing Address">Billing Address</option>
                              <option value="Home Address">Home Address</option>
                              <option value="Office Address">Office Address</option>
                            </select>
                            <input 
                              type="text" 
                              required
                              value={addressForm.name} 
                              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                              placeholder="Receiver's Name"
                              className="w-full px-3 py-1.5 rounded-lg border border-[#e2e8e2] outline-none text-xs bg-white focus:border-[#2d4a36]"
                            />
                            <input 
                              type="text" 
                              required
                              value={addressForm.street} 
                              onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                              placeholder="Street Address"
                              className="w-full px-3 py-1.5 rounded-lg border border-[#e2e8e2] outline-none text-xs bg-white focus:border-[#2d4a36]"
                            />
                            <input 
                              type="text" 
                              required
                              value={addressForm.city} 
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              placeholder="City, ZIP"
                              className="w-full px-3 py-1.5 rounded-lg border border-[#e2e8e2] outline-none text-xs bg-white focus:border-[#2d4a36]"
                            />
                            <button 
                              type="submit" 
                              className="w-full py-1.5 rounded-lg bg-[#2d4a36] text-white font-medium text-xs hover:opacity-90"
                            >
                              Save Address
                            </button>
                          </form>
                        ) : (
                          <>
                            <div className="space-y-1.5">
                              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#2d4a36]">{addr.type}</span>
                              <h4 className="text-sm font-semibold">{addr.name}</h4>
                              <p className="text-xs text-[#5c6b60] leading-relaxed">{addr.street}<br />{addr.city}</p>
                            </div>
                            <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-[#e2e8e2]">
                              <button 
                                onClick={() => handleStartEditAddress(addr)}
                                className="text-xs font-semibold text-[#5c6b60] hover:text-[#1c2a21] transition-all"
                              >
                                Edit
                              </button>
                              <span className="text-[#e2e8e2] text-xs">|</span>
                              <button 
                                onClick={() => handleRemoveAddress(addr.id)}
                                className="text-xs font-semibold text-red-600 hover:text-red-800 transition-all"
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </section>

        </div>
      </div>
    </main>
  );
}