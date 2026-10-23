import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Rentals Kenya (Rentals.ke)',
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 border-b pb-4">
          Terms & Conditions of Use
        </h1>
        <p className="text-slate-500 text-xs">
          Last updated: September 2026
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Rentals Kenya (Rentals.ke), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should discontinue using the platform.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">2. Property Discovery & Non-Agency Disclaimer</h2>
        <p>
          Rentals Kenya acts as a discovery, marketing, and lead-generation portal for Airbnb and rental properties in Kenya. Property listings are provided based on information supplied by developers, owners, and authorized agents.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">3. Investment Projections & Non-Guaranteed Returns</h2>
        <p>
          <strong>All financial estimates, projected Airbnb nightly rates, occupancy statistics, and rental yields are indicative figures only.</strong> They do not constitute guaranteed returns, financial advice, or an offer of securities. Real estate values and short-term hospitality earnings fluctuate. Buyers must independently verify title deeds, conduct site inspections, and consult licensed advocates before executing sale agreements.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">4. Intellectual Property</h2>
        <p>
          All logos, branding, graphics, and website materials are the intellectual property of Rentals Kenya. Unauthorized duplication, reproduction, or republication of listing data without prior written permission is prohibited.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">5. Governing Law</h2>
        <p>
          These Terms and Conditions are governed by and construed in accordance with the Laws of the Republic of Kenya. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kenya.
        </p>
      </div>
    </div>
  );
}
