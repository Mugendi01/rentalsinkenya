import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  TrendingUp,
  ShieldCheck,
  Building,
  Globe2,
  Percent,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why Invest in Kenyan Real Estate & Airbnb Properties | Rentals.ke',
  description:
    'Discover the economic drivers, legal protections, and short-term rental dynamics fueling real estate investment returns across Kenya.',
};

export default function WhyInvestPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Investment Thesis</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Why Invest in Kenyan Airbnb & Rental Properties?
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Kenya remains East and Central Africa’s primary financial, diplomatic, and commercial hub. Here is an objective analysis of why short-term and rental investment properties continue to attract smart local and diaspora capital.
          </p>
        </div>

        {/* 6 Key Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              1. East Africa’s Diplomatic & Business Epicentre
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Nairobi hosts the United Nations Headquarters in Africa (UNEP & UN-Habitat), hundreds of multinational regional offices (Google, Microsoft, Visa, GE), and major NGO regional hubs. Visiting delegates, tech contractors, and expatriate consultants create consistent, year-round demand for furnished, secure serviced apartments in Kilimani, Westlands, and Kileleshwa.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              2. Enhanced Yield Potential: Airbnb vs Traditional
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Unfurnished long-term leases in Nairobi historically generate gross annual yields between 5% and 8%. In contrast, professionally managed Airbnb apartments targeting business travelers and vacationers achieve gross yields of 12% to 17%+, with revenue flowing in real time rather than waiting for annual lease renewals.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              3. Sectional Properties Act 2020 Legal Security
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kenya’s real estate legal framework underwent a landmark reform with the Sectional Properties Act 2020. Individual apartment buyers are issued independent, clean Sectional Title Deeds. This legal clarity eliminates ambiguity, secures your ownership at the Ministry of Lands, and simplifies mortgage financing and future resale.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              4. Infrastructure Corridors & Capital Appreciation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Major infrastructure projects—including the Nairobi Expressway, Southern Bypass, and modern airport links—have compressed travel times. International business executives can transit from Jomo Kenyatta International Airport (JKIA) to Westlands or Kilimani in under 20 minutes, boosting localized property values and rental liquidity.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              5. Hands-Off Turnkey Host Management
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You do not need to reside in Kenya to operate a profitable Airbnb property. Professional host operators handle listing optimization, guest screening, electronic key exchange, 5-star cleaning, and emergency maintenance. Diaspora investors can track occupancy and receive monthly net remittances directly to their international accounts or M-Pesa.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              6. Currency Hedge for Diaspora Investors
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              For Kenyans residing abroad in the US, UK, Europe, Canada, or the Gulf, investing in tangible high-spec Kenyan property creates hard-asset security back home. Many luxury short-term rental guests pay in USD or foreign currency cards, providing a natural foreign exchange hedge.
            </p>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Important Investment & Risk Consideration</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            Past property appreciation and historical Airbnb booking figures are indicative benchmarks and do not guarantee future financial performance. Occupancy is subject to seasonal travel cycles, global economic factors, and regular property upkeep. Rentals Kenya provides verified data to empower transparent decisions, and we strongly encourage all buyers to conduct legal searches and independent financial planning before closing on any property.
          </p>
        </div>

        {/* Next Step CTA */}
        <div className="text-center space-y-4 pt-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Ready to explore verified investment units?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/properties"
              className="px-6 py-3.5 rounded-xl bg-brand-navy hover:bg-brand-royal text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Browse Airbnb Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/calculator"
              className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all"
            >
              Test Returns on Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
