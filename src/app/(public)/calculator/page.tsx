import React from 'react';
import type { Metadata } from 'next';
import InvestmentCalculator from '@/components/calculator/InvestmentCalculator';
import { getSiteSettings } from '@/lib/settings';
import { Calculator, ShieldCheck, HelpCircle, TrendingUp, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Airbnb Investment & Yield Calculator Kenya | Rentals.ke',
  description:
    'Calculate projected rental yield, gross revenue, operating expenses, and net ROI for Airbnb and rental properties in Nairobi and across Kenya.',
};

export default async function CalculatorPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5 text-sky-600" />
            <span>Kenyan Real Estate Financial Modeling</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Kenya Airbnb & Rental Investment Calculator
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Simulate your gross yield, monthly operating expenses, management fees, and net return on investment (ROI) across various Kenyan property price tiers.
          </p>
        </div>

        {/* Embedded Calculator */}
        <InvestmentCalculator
          initialPrice={6800000}
          initialNightlyRate={4500}
          initialOccupancy={72}
          whatsappNumber={settings.whatsapp_number}
        />

        {/* Educational Explanations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <span>How Airbnb Investment Returns are Modeled in Kenya</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                1. Nightly Rate Benchmarks
              </h3>
              <p>
                In high-demand Nairobi suburbs like Kilimani and Westlands, modern 1-bedroom apartments typically rent for KES 3,800 to 5,500 per night, while executive 2-bedroom units range from KES 7,000 to 12,000. Coastal villas in Diani can command KES 14,000 to 30,000+ during peak travel seasons.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                2. Realistic Occupancy
              </h3>
              <p>
                Well-managed units in prime urban corridors average 65% to 75% annual occupancy (~20–23 booked nights per month). While peak months (November to January and July to August) routinely hit 85%+, sustainable financial modeling assumes conservative off-peak dips.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                3. Operating Deductions
              </h3>
              <p>
                Net yield accounts for the building service charge (covering security, lifts, generator fuel, and borehole water), in-unit WiFi, utility bills, consumable restocking, and property management fees (typically 15% to 20% for turnkey hosting).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
