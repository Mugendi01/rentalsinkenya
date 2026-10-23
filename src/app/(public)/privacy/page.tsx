import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rentals Kenya (Rentals.ke)',
};

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 border-b pb-4">
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-xs">
          Last updated: September 2026 • In compliance with the Kenya Data Protection Act, 2019
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">1. Overview</h2>
        <p>
          Rentals Kenya (Rentals.ke) is committed to safeguarding your personal information. This Privacy Policy outlines how we collect, handle, and store user information when you browse our properties, submit investment inquiries, or schedule site viewings.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">2. Information We Collect</h2>
        <p>
          We only collect personal information that you voluntarily provide to us, which includes:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Full name</li>
          <li>Phone number and WhatsApp contact details</li>
          <li>Email address</li>
          <li>Investment preferences, budgets, and viewing requests</li>
        </ul>

        <h2 className="text-base font-bold text-slate-900 pt-2">3. How We Use Your Data</h2>
        <p>
          Your information is used strictly to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Facilitate direct communication regarding property availability and financial statements</li>
          <li>Schedule on-site or virtual property inspections</li>
          <li>Provide customer support via WhatsApp, phone, or email</li>
          <li>Maintain internal records of viewing appointments and leads</li>
        </ul>

        <h2 className="text-base font-bold text-slate-900 pt-2">4. Data Confidentiality & Sharing</h2>
        <p>
          We do not sell, rent, or lease customer data to third-party advertisers. Personal details are shared only with authorized staff and licensed legal conveyancers assisting directly with your property transaction.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">5. Contact Us</h2>
        <p>
          If you have questions regarding your data under the Kenya Data Protection Act, contact us at <a href="mailto:privacy@rentals.ke" className="text-sky-600 underline">privacy@rentals.ke</a> or via our office in Westlands, Nairobi.
        </p>
      </div>
    </div>
  );
}
