import React from 'react';
import Link from 'next/link';
import BrandLogo from '../ui/BrandLogo';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { SiteSettingsMap } from '@/lib/settings';

interface FooterProps {
  settings?: SiteSettingsMap;
}

export default function Footer({ settings }: FooterProps) {
  const phone = settings?.phone_number || '+254100382352';
  const email = settings?.email || 'invest@rentals.ke';
  const address = settings?.office_address || 'The Oval, 4th Floor, Ring Road Parklands, Westlands, Nairobi, Kenya';
  const hours = settings?.business_hours || 'Mon - Sat: 8:00 AM - 6:00 PM EAT';
  const instagramUrl = settings?.instagram_url || 'https://instagram.com/rentals.kenya';

  return (
    <footer className="bg-brand-darkest text-slate-300 border-t border-brand-royal/40">
      {/* Top Banner / Call to Action Strip */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-royal to-brand-navy border-b border-brand-muted/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Looking for a rental home or an Airbnb business in Kenya?
            </h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Connect with our leasing and property specialists today for verified rental apartments, houses, and turnkey Airbnb business takeover opportunities.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#rental-listings"
              className="px-5 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20"
            >
              Browse Rental Listings
            </Link>
            <Link
              href="/properties"
              className="px-5 py-3 rounded-lg bg-brand-surface hover:bg-brand-royal text-white border border-brand-muted font-semibold text-sm transition-all"
            >
              Airbnb Takeovers
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" />
            <p className="text-slate-400 text-sm leading-relaxed pr-6">
              Rentals Kenya (Rentals.ke) is Kenya’s dedicated marketplace for residential rental apartments and houses, as well as turnkey Airbnb business takeovers and furnished setups for sale. Connecting tenants and investors with verified properties across Nairobi and top destinations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-brand-navy border border-brand-royal text-pink-400 hover:bg-brand-royal transition-colors"
                aria-label="Rentals Kenya Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <span className="text-xs text-slate-400 font-medium">
                Follow @rentals.kenya for daily listing drops
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#rental-listings" className="text-slate-400 hover:text-sky-400 transition-colors font-medium text-sky-300">
                  Houses & Apartments for Rent
                </Link>
              </li>
              <li>
                <Link href="/properties?isAirbnbReady=true" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Airbnb Business Takeovers
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-slate-400 hover:text-sky-400 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/locations" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Strategic Locations
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-slate-400 hover:text-sky-400 transition-colors">
                  ROI & Yield Calculator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Strategic Hubs */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Prime Locations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/properties?location=Kilimani" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Kilimani, Nairobi
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Westlands" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Westlands, Nairobi
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Kileleshwa" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Kileleshwa, Nairobi
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Diani" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Diani Beach, Coast
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Ruaka" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Ruaka, Kiambu
                </Link>
              </li>
              <li>
                <Link href="/properties?location=Naivasha" className="text-slate-400 hover:text-sky-400 transition-colors">
                  Naivasha, Nakuru
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Contact & Office
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Disclaimer Box */}
        <div className="mt-12 p-4 rounded-xl bg-brand-navy/60 border border-brand-royal/40 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Investment Disclaimer & Financial Transparency</span>
          </div>
          <p>
            All financial forecasts, estimated Airbnb nightly rates, projected monthly and annual rental yields, and occupancy figures displayed on Rentals Kenya (Rentals.ke) are estimates compiled from historical market averages and standard operating benchmarks. They are provided solely for indicative evaluation purposes and do not represent guaranteed cash flow, capital appreciation, or fixed income returns. Real estate values and short-term rental demand may fluctuate. Potential investors must perform independent financial, legal, and site due diligence before concluding any purchase agreement.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-brand-royal/30 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Rentals Kenya (Rentals.ke). All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              About Us
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/faq" className="hover:text-slate-300 transition-colors">
              FAQ
            </Link>
            <Link href="/admin/login" className="hover:text-sky-400 text-slate-400 transition-colors font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
