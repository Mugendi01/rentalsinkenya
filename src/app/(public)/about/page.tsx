import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import BrandLogo from '@/components/ui/BrandLogo';
import {
  Building2,
  ShieldCheck,
  Target,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Rentals Kenya (Rentals.ke)',
  description:
    'Learn about Rentals Kenya, Kenya’s premier platform for residential rental apartments and houses, as well as turnkey Airbnb business takeovers.',
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy text-sky-300 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Our Company Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About Rentals Kenya
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Kenya&apos;s premier platform for discovering verified houses and apartments for rent, alongside turnkey Airbnb business takeovers and furnished setups for sale.
          </p>
        </div>

        {/* Brand Philosophy Card */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <BrandLogo variant="dark" size="lg" />
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            <p>
              In Kenya’s vibrant property market, finding a trustworthy rental home or a high-performing hospitality business should be clear, transparent, and direct. We help tenants find quality, move-in ready apartments and houses across Nairobi&apos;s prime residential areas.
            </p>
            <p>
              Simultaneously, we provide entrepreneurs and investors with turnkey Airbnb business takeovers fully equipped units with verified furniture, appliances, inventory, and transferable tenancy agreements.
            </p>
            <p className="font-semibold text-slate-900">
              Rentals Kenya bridges the gap between seekers, landlords, and hospitality operators with full legal clarity, transparent pricing, and direct support on +254100382352.
            </p>
          </div>
        </div>

        {/* Our Pillars of Operation */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              Our Core Commitments
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Principles guiding how we evaluate and present properties to investors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Data-Backed Financial Models
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We clearly differentiate between conservative, realistic, and peak-season yields. We do not make exaggerated or guaranteed return promises.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Verified Listing Standards
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before marking a property as "Airbnb Ready", we verify essential operational requirements: building approval for short-term lets, backup generators, borehole water, and robust 24/7 security.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Dedicated Diaspora Services
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tailored workflows for Kenyans abroad, including live video walkthroughs, independent advocate referrals, and turnkey host management onboarding.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                End-to-End Support
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                From initial discovery and on-site inspection to advocate conveyance and connecting you with reputable property managers, we support you through every stage.
              </p>
            </div>
          </div>
        </div>

        {/* Company Information & Placeholders */}
        <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="font-bold text-slate-800 text-sm">
            Company & Transparency Notice
          </div>
          <p className="leading-relaxed">
            Rentals Kenya operates in full compliance with Kenyan real estate standards and consumer disclosure norms. Listing representations, photos, and financial figures are verified with authorized property developers, individual owners, and vetted management partners.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-navy hover:bg-brand-royal text-white font-bold text-sm shadow-xl transition-all"
          >
            <span>Connect with Rentals Kenya</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
