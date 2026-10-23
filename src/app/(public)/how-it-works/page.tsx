import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Compass,
  FileSearch,
  Calendar,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works | Buying Airbnb Property in Kenya | Rentals.ke',
  description:
    'Step-by-step roadmap for local and diaspora buyers purchasing Airbnb-ready and rental investment properties in Kenya.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Explore & Shortlist Properties',
      desc: 'Browse our curated collection of Airbnb-ready apartments and high-yield properties in strategic hubs like Kilimani, Westlands, Kileleshwa, and Diani Beach. Filter by budget, bedroom count, and projected ROI.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'Review Financial & Operating Projections',
      desc: 'Analyze realistic nightly rate benchmarks, average historical occupancy, building service charges, and management fees. Test your assumptions using our interactive Investment Calculator.',
      icon: FileSearch,
    },
    {
      num: '03',
      title: 'Schedule a Private Site Inspection',
      desc: 'Book an on-site viewing to inspect finishing quality, building amenities (pool, gym, backup power, water borehole), and security. For diaspora investors, we arrange live virtual video tours and building inspections.',
      icon: Calendar,
    },
    {
      num: '04',
      title: 'Legal Due Diligence & Purchase',
      desc: 'Receive the official Letter of Offer, conduct official title searches via Ardhisasa / Ministry of Lands, execute the Sale Agreement with licensed advocates, and complete payment via safe escrow or bank financing.',
      icon: KeyRound,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Clear & Transparent Guidance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How Rentals Kenya Works
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            A structured, secure, and transparent acquisition roadmap designed for local investors and diaspora buyers worldwide.
          </p>
        </div>

        {/* 4 Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden group hover:border-sky-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-navy text-sky-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-sky-200 transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Diaspora Investor Support Section */}
        <div className="bg-brand-navy rounded-3xl text-white p-8 sm:p-12 border border-brand-royal/60 shadow-xl space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              For Kenyans Abroad
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Buying from the Diaspora? We Make It Safe & Seamless.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              You do not need to fly to Nairobi to purchase or manage your property. Rentals Kenya provides specialized diaspora support services:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-brand-surface/70 p-4 rounded-2xl border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Live Video Tours
              </h4>
              <p className="text-xs text-slate-300">
                Detailed one-on-one walkthroughs of the apartment, building common areas, rooftop amenities, and neighborhood.
              </p>
            </div>

            <div className="bg-brand-surface/70 p-4 rounded-2xl border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Advocate Due Diligence
              </h4>
              <p className="text-xs text-slate-300">
                Independent legal title deed searches at the Ministry of Lands and verified escrow accounts.
              </p>
            </div>

            <div className="bg-brand-surface/70 p-4 rounded-2xl border border-white/10 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Full Host Onboarding
              </h4>
              <p className="text-xs text-slate-300">
                Direct handoff to verified Nairobi/Diani Airbnb operators who furnish, list, and remit monthly earnings directly to you.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow-xl shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>Start Exploring Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
