"use client";

import React, { useState } from 'react';
import { HiEnvelope, HiPhone, HiMapPin, HiClock } from 'react-icons/hi2';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div data-theme="sage" className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="h-px w-8 bg-[var(--muted)]/40" />
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)]">
              Get in Touch
            </h1>
            <span className="h-px w-8 bg-[var(--muted)]/40" />
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md mx-auto px-4">
            Have a question or want to chat? Send us a message and we will respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-[#e8ece8] rounded-2xl border border-[var(--border)] p-6 sm:p-8 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] shrink-0">
                  <HiEnvelope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Email Us</h3>
                  <p className="text-sm text-[var(--muted)] mt-1">support@yourdomain.com</p>
                  <p className="text-xs text-[var(--muted)]">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] shrink-0">
                  <HiPhone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Call Us</h3>
                  <p className="text-sm text-[var(--muted)] mt-1">+1 (555) 234-5678</p>
                  <p className="text-xs text-[var(--muted)]">Mon-Fri from 9am to 5pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] shrink-0">
                  <HiMapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Visit Showroom</h3>
                  <p className="text-sm text-[var(--muted)] mt-1">128 Aesthetic Way, Suite 400</p>
                  <p className="text-xs text-[var(--muted)]">New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] shrink-0">
                  <HiClock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Showroom Hours</h3>
                  <p className="text-sm text-[var(--muted)] mt-1">Mon - Sat: 10am - 6pm</p>
                  <p className="text-xs text-[var(--muted)]">Sunday: Closed</p>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-7 bg-[#e8ece8] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] px-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                    placeholder="Jane Doe"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] px-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] px-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                  placeholder="How can we help you?"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] px-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 transition resize-none"
                  placeholder="Tell us details about your inquiry..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {status === 'success' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs text-center font-semibold">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {status === 'error' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs text-center font-semibold">
                  Something went wrong. Please try again.
                </div>
              )}

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}