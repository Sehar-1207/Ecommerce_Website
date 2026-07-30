"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { User, LogOut, Calendar, Phone, Mail, AlertCircle } from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  joined?: string;
  image?: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/auth?redirect=account');
        return;
      }

      try {
        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        const hasWelcomed = sessionStorage.getItem('toast_welcomed');
        if (!hasWelcomed) {
          sessionStorage.setItem('toast_welcomed', 'true');
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth?redirect=account');
          return;
        }

        const message = err.response?.data?.message || 'An error occurred while loading profile';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    sessionStorage.removeItem('toast_welcomed');
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      router.push('/');
    }, 400);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d4a36]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button
          onClick={() => router.push('/auth?redirect=account')}
          className="px-4 py-2 bg-[#2d4a36] text-white rounded-lg text-sm"
        >
          Return to Login
        </button>
      </div>
    );
  }

  if (!user) return null;

  const formattedJoinedDate = user.joined
    ? user.joined
    : user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Member';

  return (
    <div className="min-h-[70vh] bg-[#fcfdfc] py-12 px-4 sm:px-6 lg:px-8 text-[#1c2a21]">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-semibold mb-8 text-[#1c2a21]">My Account</h1>

        <div className="bg-white border border-[#e2e8e2] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-4 border-b border-[#e2e8e2] pb-6">
            <div className="relative h-16 w-16 rounded-full bg-[#e8ece8] flex items-center justify-center text-[#2d4a36] overflow-hidden border border-[#e2e8e2]">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-medium">{user.name}</h2>
              <p className="text-xs text-[#5c6b60] flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" /> {formattedJoinedDate}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5c6b60] flex items-center">
                <Mail className="h-4 w-4 mr-2 text-[#2d4a36]" /> Email Address
              </span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-zinc-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5c6b60] flex items-center">
                <Phone className="h-4 w-4 mr-2 text-[#2d4a36]" /> Contact Phone
              </span>
              <span className="text-sm font-medium">{user.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSignOut}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#e2e8e2] hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}