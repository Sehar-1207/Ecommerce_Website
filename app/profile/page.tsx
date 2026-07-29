"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Package, MapPin, LogOut, Edit3, ShoppingBag, Plus, X, Lock, Mail, KeyRound, UserPlus, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joined?: string;
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
type AuthMode = 'login' | 'signup';

export default function ProfilePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  
  // Form Inputs for Auth Modal
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Profile Page State
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  
  const [currentUser, setCurrentUser] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [addressForm, setAddressForm] = useState({
    type: "Shipping Address",
    name: "",
    street: "",
    city: ""
  });

  // 1. Fetch User Profile from Auth API
  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setShowAuthModal(true);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Unauthorized');
      }

      const user: ProfileData = await res.json();
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowAuthModal(false);

      // Fetch user specific resource data
      fetchOrders(token);
      fetchAddresses(token);
    } catch (err) {
      // Invalid/Expired Token
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setCurrentUser(null);
      setShowAuthModal(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Orders API
  const fetchOrders = async (token: string) => {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  // Fetch Addresses API
  const fetchAddresses = async (token: string) => {
    try {
      const res = await fetch('/api/addresses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchUserProfile();

    const handleAuthChange = () => fetchUserProfile();
    window.addEventListener('userStateChanged', handleAuthChange);
    return () => window.removeEventListener('userStateChanged', handleAuthChange);
  }, [fetchUserProfile]);

  // Handle Login & Signup API Requests
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      toast.success(authMode === 'login' ? 'Welcome back!' : 'Account created successfully!');
      window.dispatchEvent(new Event('userStateChanged'));
      setShowAuthModal(false);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setAuthLoading(false);
    }
  };

  // Save Profile via API
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!currentUser || !token) return;

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentUser)
      });

      if (!res.ok) throw new Error('Failed to update profile');

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      window.dispatchEvent(new Event('userStateChanged'));
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    }
  };

  // Create Address via API
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressForm)
      });

      if (!res.ok) throw new Error('Failed to create address');
      const newAddress = await res.json();

      setAddresses(prev => [...prev, newAddress]);
      setIsAddingAddress(false);
      setAddressForm({ type: "Shipping Address", name: "", street: "", city: "" });
      toast.success("Address added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add address");
    }
  };

  // Save Edited Address via API
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !editingAddressId) return;

    try {
      const res = await fetch(`/api/addresses/${editingAddressId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressForm)
      });

      if (!res.ok) throw new Error('Failed to update address');

      setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, ...addressForm } : a));
      setEditingAddressId(null);
      toast.success("Address updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update address");
    }
  };

  // Remove Address via API
  const handleRemoveAddress = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete address');

      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success("Address removed.");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove address");
    }
  };

  // Sign Out
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    window.dispatchEvent(new Event('userStateChanged'));
    toast.success("Signed out successfully.");
    setShowAuthModal(true);
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen w-full bg-[#fafaf9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1c2a21]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 sm:mb-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">My Account</h1>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#5c6b60]">
            Manage your personal details, order history, and address books.
          </p>
        </header>

        {/* ----------------- AUTHENTICATED USER PROFILE ----------------- */}
        {isAuthenticated && currentUser ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            <aside className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-2 border-b border-[#e2e8e2] lg:border-0">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'profile' ? "bg-[#2d4a36] text-white" : "hover:bg-[#e2e8e2]/40 text-[#5c6b60]"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Personal Details</span>
              </button>

              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'orders' ? "bg-[#2d4a36] text-white" : "hover:bg-[#e2e8e2]/40 text-[#5c6b60]"
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Orders</span>
              </button>

              <button 
                onClick={() => setActiveTab('addresses')}
                className={`flex-shrink-0 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'addresses' ? "bg-[#2d4a36] text-white" : "hover:bg-[#e2e8e2]/40 text-[#5c6b60]"
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Addresses</span>
              </button>

              <hr className="hidden lg:block border-[#e2e8e2] my-4" />

              <button 
                onClick={handleSignOut}
                className="flex-shrink-0 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-all ml-auto lg:ml-0"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </aside>

            <section className="lg:col-span-3 bg-white border border-[#e2e8e2] rounded-2xl p-5 sm:p-8 shadow-sm">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#e2e8e2]">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-14 w-14 rounded-full bg-[#e8ece8] flex items-center justify-center text-[#2d4a36] overflow-hidden border border-[#e2e8e2]">
                        {currentUser.image ? (
                          <Image src={currentUser.image} alt={currentUser.name} fill className="object-cover" />
                        ) : (
                          <User className="h-6 w-6 stroke-[1.5]" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold">{currentUser.name}</h2>
                        <p className="text-[11px] sm:text-xs text-[#5c6b60]">{currentUser.joined || 'Member'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-1.5 text-xs font-semibold text-[#2d4a36]"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                    </button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#5c6b60] mb-1">Full Name</label>
                          <input 
                            type="text" 
                            value={currentUser.name} 
                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-[#e2e8e2] text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#5c6b60] mb-1">Email Address</label>
                          <input 
                            type="email" 
                            value={currentUser.email} 
                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-[#e2e8e2] text-sm"
                            required
                          />
                        </div>
                      </div>
                      <button type="submit" className="rounded-xl bg-[#2d4a36] px-5 py-2.5 text-xs text-white">
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div>
                        <span className="text-xs font-semibold text-[#5c6b60]">Full Name</span>
                        <p className="text-sm font-medium">{currentUser.name}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#5c6b60]">Email Address</span>
                        <p className="text-sm font-medium">{currentUser.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold border-b pb-3">Order History</h2>
                  {orders.length === 0 ? (
                    <p className="text-sm text-zinc-500 py-8 text-center">No orders found.</p>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="p-4 border rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{order.id}</p>
                          <p className="text-xs text-zinc-500">{order.item}</p>
                        </div>
                        <span className="font-bold text-sm">{order.total}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">Saved Addresses</h2>
                    <button 
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      className="text-xs border px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      {isAddingAddress ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                      <span>{isAddingAddress ? 'Cancel' : 'Add New'}</span>
                    </button>
                  </div>

                  {isAddingAddress && (
                    <form onSubmit={handleCreateAddress} className="p-4 border rounded-xl bg-emerald-50/20 space-y-3">
                      <input 
                        placeholder="Receiver Name" 
                        value={addressForm.name} 
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        className="w-full p-2 text-xs border rounded-lg"
                        required 
                      />
                      <input 
                        placeholder="Street Address" 
                        value={addressForm.street} 
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full p-2 text-xs border rounded-lg"
                        required 
                      />
                      <input 
                        placeholder="City, Zip" 
                        value={addressForm.city} 
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full p-2 text-xs border rounded-lg"
                        required 
                      />
                      <button type="submit" className="bg-[#2d4a36] text-white px-4 py-2 text-xs rounded-lg">Save</button>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="p-4 border rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-[#2d4a36] uppercase">{addr.type}</span>
                        <h4 className="text-sm font-semibold">{addr.name}</h4>
                        <p className="text-xs text-zinc-500">{addr.street}, {addr.city}</p>
                        <button onClick={() => handleRemoveAddress(addr.id)} className="text-xs text-red-600 mt-2 block">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* ----------------- UNAUTHENTICATED PLACEHOLDER CARD ----------------- */
          <div className="p-12 text-center bg-white border border-[#e2e8e2] rounded-2xl max-w-md mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-[#2d4a36]/10 text-[#2d4a36] mx-auto flex items-center justify-center">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">Authentication Required</h2>
            <p className="text-xs text-[#5c6b60]">Please sign in or create an account to view and manage your profile details.</p>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-[#2d4a36] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:opacity-95"
            >
              Sign In / Sign Up
            </button>
          </div>
        )}
      </div>

      {/* ----------------- AUTHENTICATION MODAL (LOGIN / SIGNUP) ----------------- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e2e8e2] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header Tab Switcher */}
            <div className="flex border-b border-[#e2e8e2] bg-[#fafaf9]">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3.5 text-xs font-semibold transition-all border-b-2 ${
                  authMode === 'login' 
                    ? "border-[#2d4a36] text-[#2d4a36] bg-white" 
                    : "border-transparent text-[#5c6b60] hover:text-[#1c2a21]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3.5 text-xs font-semibold transition-all border-b-2 ${
                  authMode === 'signup' 
                    ? "border-[#2d4a36] text-[#2d4a36] bg-white" 
                    : "border-transparent text-[#5c6b60] hover:text-[#1c2a21]"
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
              <div className="text-center pb-2">
                <h3 className="text-base font-bold text-[#1c2a21]">
                  {authMode === 'login' ? 'Welcome Back' : 'Join Us Today'}
                </h3>
                <p className="text-xs text-[#5c6b60] mt-1">
                  {authMode === 'login' 
                    ? 'Enter your details to access your account' 
                    : 'Fill in the information below to get started'}
                </p>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#5c6b60] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[#e2e8e2] outline-none focus:border-[#2d4a36]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#5c6b60] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3 top-3 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[#e2e8e2] outline-none focus:border-[#2d4a36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5c6b60] mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="h-4 w-4 absolute left-3 top-3 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[#e2e8e2] outline-none focus:border-[#2d4a36]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-2 py-3 rounded-xl bg-[#2d4a36] text-white text-xs font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {authLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-xs text-[#2d4a36] font-medium hover:underline"
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </main>
  );
}