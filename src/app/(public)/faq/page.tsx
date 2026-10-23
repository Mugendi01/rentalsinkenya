import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Investor Frequently Asked Questions | Rentals.ke',
  description:
    'Answers to essential real estate, Airbnb management, title deeds, taxation, and diaspora buying questions in Kenya.',
};

export default function FaqPage() {
  const faqs = [
    {
      category: 'Airbnb Operations & Management',
      items: [
        {
          q: 'What is an "Airbnb-ready" property?',
          a: 'An Airbnb-ready property is either sold turnkey (complete with modern furniture, curated décor, hotel-grade linens, smart locks, and kitchen appliances) or is situated within a high-spec residential development that permits short-term serviced lets, equipped with essential utilities like full backup generators and borehole water.',
        },
        {
          q: 'Who manages the Airbnb if I live outside Nairobi or abroad?',
          a: 'You can appoint a professional third-party host management agency. In Nairobi and coastal hubs, reputable managers handle guest check-in/out, professional cleaning, 24/7 communications, algorithmic pricing, and maintenance, typically charging 15% to 20% of net booking revenues.',
        },
        {
          q: 'What are the realistic occupancy rates in Kilimani and Westlands?',
          a: 'For high-quality units with modern amenities (gym, rooftop pool, high-speed WiFi), historical average annual occupancy in Kilimani and Westlands ranges between 65% and 78%. Busy corporate travel and holiday seasons (Nov–Jan, Jun–Aug) often exceed 80%.',
        },
      ],
    },
    {
      category: 'Legal & Title Deeds',
      items: [
        {
          q: 'What type of title deed do I receive for an apartment in Kenya?',
          a: 'Under the Sectional Properties Act 2020, buyers receive an individual registered Sectional Title Deed. This is a clean, legally binding document conferring individual ownership of your specific unit along with proportional ownership in the common property.',
        },
        {
          q: 'Can foreigners or diaspora Kenyans legally purchase property in Kenya?',
          a: 'Yes. Under Kenyan law, foreign nationals and Kenyan diaspora citizens have the full legal right to purchase sectional leasehold property. The process is conducted through registered Kenyan advocates and title verification via the Ministry of Lands Ardhisasa platform.',
        },
        {
          q: 'What are the typical closing costs when purchasing property in Kenya?',
          a: 'Standard closing costs include: Stamp Duty (4% of property value within municipalities/cities), legal conveyance fees (typically 1% to 2% + VAT as per the Advocates Remuneration Order), valuation fees, and minor registration/search disbursements.',
        },
      ],
    },
    {
      category: 'Financial Returns & Taxes',
      items: [
        {
          q: 'How are Airbnb earnings taxed in Kenya?',
          a: 'Rental income in Kenya is subject to Monthly Rental Income (MRI) tax administered by the Kenya Revenue Authority (KRA), currently set at a simplified flat rate of 7.5% on gross rental income for residential properties under KES 15 million per year.',
        },
        {
          q: 'Are the projected returns on Rentals Kenya guaranteed?',
          a: 'No. In accordance with ethical advertising and real estate disclosure laws, all figures presented on Rentals Kenya (Rentals.ke) are historical estimates and projections. Actual income varies based on seasonal demand, hospitality quality, reviews, and economic factors.',
        },
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about investing in Airbnb and rental properties across Kenya.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {faqs.map((cat, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                {cat.category}
              </h2>

              <div className="space-y-3">
                {cat.items.map((item, qIdx) => (
                  <div
                    key={qIdx}
                    className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-sm"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                      <span>{item.q}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="bg-brand-navy rounded-3xl p-8 text-white text-center space-y-4">
          <h3 className="text-xl font-bold">Have a question not covered here?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Our investment team is on standby to assist with bespoke queries, legal checks, or scheduling property viewings.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all"
          >
            <span>Talk to Rentals Kenya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
