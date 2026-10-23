import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import type { Prisma, Location } from '@prisma/client';
import { getSiteSettings } from '@/lib/settings';

type FeaturedProperty = Prisma.PropertyGetPayload<{
  include: {
    images: true;
  };
}>;

type RentalProperty = Prisma.PropertyGetPayload<{
  include: {
    images: true;
    amenities: {
      include: {
        amenity: true;
      };
    };
  };
}>;
import { formatKES, buildWhatsAppUrl } from '@/lib/formatters';
import HeroSearch from '@/components/home/HeroSearch';
import HousesForRentSection from '@/components/home/HousesForRentSection';
import PropertyCard from '@/components/properties/PropertyCard';
import InvestmentCalculator from '@/components/calculator/InvestmentCalculator';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Building,
  Home,
  Key,
  Compass,
  ArrowRight,
  MessageCircle,
  Phone,
  CheckCircle2,
  ChevronDown,
  FileCheck,
  Percent,
  HelpCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const settings = await getSiteSettings();

  let featuredProperties: FeaturedProperty[] = [];
  let rentalProperties: RentalProperty[] = [];
  let locations: Location[] = [];
  const locationCounts: Record<string, number> = {};

  try {
    // Fetch Featured Properties (Available or Featured - Secondary Offering: Airbnb Takeovers)
    featuredProperties = await prisma.property.findMany({
      where: {
        status: { not: 'HIDDEN' },
        isFeatured: true,
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
          take: 1,
        },
      },
    });

    // Fetch Rental Properties (Apartments & Houses for Rent - Primary Business)
    rentalProperties = await prisma.property.findMany({
      where: {
        status: { not: 'HIDDEN' },
      },
      orderBy: [
        { isAirbnbReady: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });

    // Fetch Locations with property counts
    locations = await prisma.location.findMany({
      orderBy: { displayOrder: 'asc' },
      take: 6,
    });

    // Count properties per location dynamically
    for (const loc of locations) {
      const count = await prisma.property.count({
        where: {
          neighbourhood: { contains: loc.name },
          status: { not: 'HIDDEN' },
        },
      });
      locationCounts[loc.name] = count;
    }
  } catch (error) {
    console.warn('Could not fetch homepage listings from database:', error);
  }

  const advisorWhatsAppUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    'Hello Rentals Kenya, I would like to speak with an advisor regarding finding an apartment or house for rent in Kenya.'
  );

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. HERO SECTION WITH ATTACHED ARCHITECTURAL BACKGROUND */}
      <section className="relative min-h-[660px] lg:min-h-[740px] flex flex-col justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
        {/* Background Image - Clean, Natural Colors with Zero Blue Tint */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-building.jpg"
            alt="Rentals in Kenya - Modern residential apartments and high-rises"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[center_35%] sm:object-[center_28%]"
          />
          {/* Neutral dark gradient overlay for optimal legibility without any blue hue */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/85" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-4">
          {/* Primary Business & Service Scope Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/75 border border-white/20 text-white text-xs font-semibold backdrop-blur-md shadow-lg shadow-black/50 animate-in fade-in duration-500">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              
            </div>
            <span className="text-white/40 hidden sm:inline">•</span>
            <div className="text-white/90 hidden sm:flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] drop-shadow-lg">
            Find Verified{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
              Houses & Apartments
            </span>{' '}
            for Rent in Kenya
          </h1>

          {/* Subtitle */}
          <p className="text-white/95 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-md">
            Discover vetted, move-in ready rental apartments and residential homes across Nairobi, Kilimani, Westlands, Kileleshwa, and prime Kenyan neighborhoods. Plus, explore turnkey Airbnb business takeovers and furnished setups for sale.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* Primary CTA: Browse Apartment Rentals */}
            <a
              href="#rental-listings"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 group cursor-pointer"
            >
              <Building className="w-4 h-4 text-slate-950" />
              <span>Browse Apartment Rentals</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Secondary CTA: Airbnb Business Takeovers */}
            <Link
              href="/properties?isAirbnbReady=true"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm sm:text-base backdrop-blur-md transition-all flex items-center gap-2 group hover:border-amber-400/50 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Airbnb Business Takeovers</span>
            </Link>

            {/* WhatsApp Direct Line */}
            <a
              href={advisorWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 font-bold text-sm sm:text-base backdrop-blur-md transition-all flex items-center gap-2 shadow-lg shadow-black/40"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Chat on WhatsApp </span>
            </a>
          </div>

          {/* Value Pillars Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto pt-2 text-left">
            <div className="p-3.5 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md flex items-start gap-3 shadow-lg">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0 mt-0.5">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Rental Homes & Units</span>
                  <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded font-black">
                    Primary
                  </span>
                </h2>
                <p className="text-[11px] text-white/80 leading-snug mt-1">
                  Move-in ready apartments, studios, and family homes with verified landlord lease terms and monthly rent.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md flex items-start gap-3 shadow-lg">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Airbnb Takeovers</span>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-black">
                    For Sale
                  </span>
                </h2>
                <p className="text-[11px] text-white/80 leading-snug mt-1">
                  100% furnished setups for sale with verified inventory, appliances, and direct lease transfers.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md flex items-start gap-3 shadow-lg">
              <div className="p-2 rounded-xl bg-white/15 text-white flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Fast Viewings & Support
                </h2>
                <p className="text-[11px] text-white/80 leading-snug mt-1">
                  Direct WhatsApp support with scheduled in-person and virtual inspections.
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Hero Search Filter */}
          <div className="pt-4 sm:pt-6">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* 2. RENTAL LISTINGS SECTION (IMMEDIATELY BELOW HERO - PRIMARY BUSINESS) */}
      <HousesForRentSection
        properties={rentalProperties}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* 3. AIRBNB BUSINESS TAKEOVERS & FURNISHED SETUPS (SECONDARY OFFERING) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Secondary Offering: Turnkey Setups for Sale</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Airbnb Business Takeovers & Furnished Setups
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Fully equipped, ready-to-run Airbnb setups for sale with verified furniture, appliances, inventory, and transferable tenancy agreements.
            </p>
          </div>

          <Link
            href="/properties?isAirbnbReady=true"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors self-start md:self-auto"
          >
            <span>Explore All Airbnb Takeovers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              whatsappNumber={settings.whatsapp_number}
            />
          ))}
        </div>
      </section>

      {/* 4. WHY RENTALS KENYA */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
              Why Rentals Kenya
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              The Smarter Way to Rent or Take Over an Airbnb
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Whether you are looking for an executive rental apartment in Nairobi or acquiring a turnkey Airbnb setup, we provide vetted properties and transparent terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Verified Rental Houses & Apartments
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Direct tenancy listings with confirmed monthly rent, verified security deposits, and legitimate landlord contacts across Kilimani, Westlands, Kileleshwa, and Lavington.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Turnkey Airbnb Business Takeovers
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Step directly into high-yield short-term rentals without setting up from scratch. Complete inventory verification, transferable landlord leases, and transparent asset pricing.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Dedicated Concierge & Fast Viewings
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Direct WhatsApp assistance via +254100382352. Book scheduled in-person inspections or high-definition virtual tours for diaspora clients and busy executives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW RENTALS KENYA WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Frictionless Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            How Rentals Kenya Works
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            A seamless journey from browsing verified listings to signing your tenancy or completing your takeover.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center md:text-left space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-navy text-sky-400 font-extrabold text-sm flex items-center justify-center mx-auto md:mx-0">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Browse Listings
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore available rental apartments and houses or filter turnkey Airbnb takeovers by location, rent, and bedrooms.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center md:text-left space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-navy text-sky-400 font-extrabold text-sm flex items-center justify-center mx-auto md:mx-0">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Check Specs & Terms
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Examine transparent monthly rent, service charges, furnished inventories, and tenancy lease details.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center md:text-left space-y-3">
            <div className="w-10 h-10 rounded-full bg-brand-navy text-sky-400 font-extrabold text-sm flex items-center justify-center mx-auto md:mx-0">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Schedule a Viewing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly on WhatsApp (+254100382352) or submit an online request for an on-site inspection or virtual walkthrough.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center md:text-left space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto md:mx-0">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Move In or Take Over
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Finalize your tenancy lease agreement or complete the business takeover transfer with legal transparency.
            </p>
          </div>
        </div>
      </section>

      {/* 6. POPULAR LOCATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
              Strategic Corridors
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Top Kenyan Property Markets
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Prime residential and rental hubs commanding strong tenant demand and high booking velocity.
            </p>
          </div>

          <Link
            href="/locations"
            className="text-sm font-bold text-sky-600 hover:text-sky-700 self-start md:self-auto"
          >
            Explore All Locations &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => {
            const count = locationCounts[loc.name] || 0;
            return (
              <Link
                key={loc.id}
                href={`/properties?location=${loc.name}`}
                className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={loc.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                  alt={loc.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-sky-300 transition-colors">
                      {loc.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                      {count} {count === 1 ? 'Unit' : 'Units'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {loc.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 7. INTERACTIVE INVESTMENT & YIELD CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InvestmentCalculator
          initialPrice={6800000}
          initialNightlyRate={4500}
          initialOccupancy={72}
          whatsappNumber={settings.whatsapp_number}
        />
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Answers to key questions about renting houses, apartments, and acquiring Airbnb takeovers in Kenya.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              How do I browse and rent an apartment or house on Rentals Kenya?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              You can browse our verified rental listings directly on the homepage or through our search filters. Each listing provides detailed photos, verified monthly rent, room specifications, and amenity lists. To schedule a viewing or request lease terms, click the WhatsApp button to chat directly with our leasing desk or submit a viewing request.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
              What is an Airbnb business takeover or furnished setup?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              As a secondary offering, Rentals Kenya features turnkey Airbnb business takeovers. An entrepreneur or investor purchases the full physical setup (furniture, modern appliances, smart lock, linens, tableware) and takes over the tenancy lease with confirmed landlord authorization, allowing you to start hosting immediate bookings.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
              How do I schedule an in-person or virtual property viewing?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              Our leasing team conducts property walkthroughs Monday through Saturday. You can book an appointment via our website enquiry forms or message us directly on WhatsApp at +254100382352. For diaspora or out-of-town clients, we provide live interactive video tours.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
              Are the projected Airbnb financial returns guaranteed?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              No. In accordance with professional real estate standards, all Airbnb returns and yield metrics are estimates based on historical market data and seasonal hospitality trends. We provide realistic, conservative financial models to assist buyers in their evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* 9. FINAL CONVERSION CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-brand-darkest via-brand-navy to-brand-royal text-white p-8 sm:p-14 overflow-hidden border border-brand-muted/40 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
              Direct Contact & Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Looking for a Rental Home or Airbnb Setup in Kenya?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Talk to Rentals Kenya today on <strong className="text-white">+254100382352</strong>. Our leasing and property specialists are ready to help you find your ideal rental apartment or explore turnkey Airbnb business opportunities.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href={advisorWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+254100382352)</span>
              </a>

              <a
                href="tel:+254100382352"
                className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call +254100382352</span>
              </a>

              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all"
              >
                Schedule Private Viewing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
