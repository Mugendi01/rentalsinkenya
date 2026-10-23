import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { getSiteSettings } from '@/lib/settings';

type PropertyDetail = Prisma.PropertyGetPayload<{
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
import PropertyGallery from '@/components/properties/PropertyGallery';
import EnquiryForm from '@/components/forms/EnquiryForm';
import ViewingForm from '@/components/forms/ViewingForm';
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building,
  CheckCircle,
  MessageCircle,
  Phone,
  Calendar,
  AlertCircle,
  ChevronRight,
  Wifi,
  Waves,
  Dumbbell,
  Zap,
  Droplets,
  Video,
  ArrowUpDown,
  Car,
  Maximize2,
  Utensils,
  Tv,
  Key,
  Sun,
  Package,
  Check,
  XCircle,
  FileText,
  DollarSign,
  Info,
} from 'lucide-react';

interface PropertyDetailPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

// Dynamic SEO metadata
export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  try {
    const property = await prisma.property.findUnique({
      where: { slug: params.slug },
    });

    if (!property) {
      return { title: 'Property Not Found | Rentals Kenya' };
    }

    const title = property.seoTitle || `${property.title} | Rentals Kenya`;
    const description =
      property.seoDescription ||
      `Ready-to-run Airbnb setup in ${property.neighbourhood}, ${property.town}. Listed at ${formatKES(property.price)}. Turnkey short-term rental opportunity.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: property.featuredImage ? [property.featuredImage] : [],
      },
    };
  } catch (error) {
    return { title: 'Rentals Kenya | Property Details' };
  }
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const settings = await getSiteSettings();

  let property: PropertyDetail | null = null;
  try {
    property = await prisma.property.findUnique({
      where: { slug: params.slug },
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
  } catch (error) {
    console.warn('Error fetching property detail:', error);
  }

  if (!property || property.status === 'HIDDEN') {
    notFound();
  }

  // Increment views counter asynchronously
  prisma.property
    .update({
      where: { id: property.id },
      data: { viewsCount: { increment: 1 } },
    })
    .catch(() => {});

  const whatsappMessage = `Hello Rentals Kenya, I am interested in "${property.title}" in ${property.neighbourhood} listed at ${formatKES(property.price)}. Please send me the takeover inventory and lease details.`;
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp_number, whatsappMessage);

  // Amenity icon mapping helper
  const renderAmenityIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4 text-sky-500" />;
      case 'waves':
        return <Waves className="w-4 h-4 text-sky-500" />;
      case 'dumbbell':
        return <Dumbbell className="w-4 h-4 text-sky-500" />;
      case 'shieldcheck':
      case 'shield':
        return <ShieldCheck className="w-4 h-4 text-sky-500" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-sky-500" />;
      case 'droplets':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-sky-500" />;
      case 'arrowupdown':
        return <ArrowUpDown className="w-4 h-4 text-sky-500" />;
      case 'car':
        return <Car className="w-4 h-4 text-sky-500" />;
      case 'maximize2':
        return <Maximize2 className="w-4 h-4 text-sky-500" />;
      case 'utensils':
        return <Utensils className="w-4 h-4 text-sky-500" />;
      case 'tv':
        return <Tv className="w-4 h-4 text-sky-500" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-sky-500" />;
      case 'key':
        return <Key className="w-4 h-4 text-sky-500" />;
      case 'sun':
        return <Sun className="w-4 h-4 text-sky-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-sky-500" />;
    }
  };

  // Parse inventory list
  let inventoryItems: string[] = [
    'King/Queen Size Bed & Orthopedic Mattress',
    '3-Seater Living Room Sofa & Accent Chairs',
    '55-inch 4K Smart TV with Soundbar',
    'Double-Door Refrigerator',
    'Microwave & Electric Kettle',
    'Full Kitchen Cookware, Crockery & Cutlery',
    'Custom Blackout Curtains & Window Drapes',
    'Designer Wall Art & Ambient Lighting',
    'High-Speed WiFi Router Setup',
    'Keyless Digital Smart Deadbolt',
    'Hotel-Grade Bedding & Towels (2 Sets)',
  ];

  if (property.inventoryList) {
    try {
      const parsed = JSON.parse(property.inventoryList);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inventoryItems = parsed;
      }
    } catch {
      inventoryItems = property.inventoryList.split('\n').filter(Boolean);
    }
  }

  // Price calculations
  const assetValue = property.assetValue || Math.round(property.price * 0.75);
  const landlordDeposit = property.landlordDeposit || Math.round((property.estMonthlyIncome || 70000) * 0.35);
  const goodwill = property.goodwill || 0;
  const totalAskingPrice = property.price || (assetValue + landlordDeposit + goodwill);
  const monthlyRent = property.monthlyRent || landlordDeposit;

  // Structured Data Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `https://rentalsinkenya.co.ke/properties/${property.slug}`,
    image: property.featuredImage,
    offers: {
      '@type': 'Offer',
      price: totalAskingPrice,
      priceCurrency: 'KES',
      availability: property.status === 'AVAILABLE' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.town,
      addressRegion: property.county,
      addressCountry: 'KE',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-slate-50 min-h-screen pb-24 sm:pb-16">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/properties" className="hover:text-slate-800 transition-colors">
                Airbnb Setups
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-sm">
                {property.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {/* Top Title & Quick Price Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-navy text-sky-300">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  Ready-to-Run Airbnb Setup
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800">
                  {property.propertyType}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    property.status === 'AVAILABLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : property.status === 'SOLD'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {property.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 mt-2">
                <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>
                  {property.address || property.neighbourhood}, {property.town}, {property.county} County, Kenya
                </span>
              </div>
            </div>

            {/* Quick Asking Price Display */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm self-start lg:self-auto text-left lg:text-right">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                Total Asking Price
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatKES(totalAskingPrice)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Monthly Tenancy Rent: <strong className="text-slate-800">{formatKES(monthlyRent)}</strong>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Image Gallery */}
              <PropertyGallery images={property.images} title={property.title} />

              {/* Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="p-2 border-r border-slate-100 last:border-0">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Bedrooms</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5 flex items-center justify-center gap-1.5">
                    <Bed className="w-4 h-4 text-sky-600" />
                    <span>{property.bedrooms}</span>
                  </div>
                </div>

                <div className="p-2 border-r border-slate-100 last:border-0">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Bathrooms</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5 flex items-center justify-center gap-1.5">
                    <Bath className="w-4 h-4 text-sky-600" />
                    <span>{property.bathrooms}</span>
                  </div>
                </div>

                <div className="p-2 border-r border-slate-100 last:border-0">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Floor Area</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5 flex items-center justify-center gap-1.5">
                    <Maximize className="w-4 h-4 text-sky-600" />
                    <span>{property.sizeSqft || '--'} sqft</span>
                  </div>
                </div>

                <div className="p-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Furnishing</span>
                  <div className="text-sm font-black text-slate-900 mt-1">
                    {property.furnishing}
                  </div>
                </div>
              </div>

              {/* SECTION 15: PRICE BREAKDOWN */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Price Breakdown</h2>
                    <p className="text-xs text-slate-500">
                      Transparent accounting of setup assets, security deposit, and goodwill
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">
                      Asset Value
                    </span>
                    <div className="text-xl font-black text-slate-900 mt-1">
                      {formatKES(assetValue)}
                    </div>
                    <span className="text-[11px] text-slate-500">Furniture, appliances & décor</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">
                      Landlord Deposit
                    </span>
                    <div className="text-xl font-black text-slate-900 mt-1">
                      {formatKES(landlordDeposit)}
                    </div>
                    <span className="text-[11px] text-slate-500">Transferable tenancy deposit</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">
                      Goodwill
                    </span>
                    <div className="text-xl font-black text-slate-900 mt-1">
                      {formatKES(goodwill)}
                    </div>
                    <span className="text-[11px] text-slate-500">Transfer premium</span>
                  </div>
                </div>

                {/* Total Asking Price Strip */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-brand-navy text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-sky-300 font-bold uppercase tracking-wider">
                      Total Asking Price
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                      {formatKES(totalAskingPrice)}
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 sm:max-w-xs sm:text-right">
                    Includes all listed physical assets, furnishings, and lease transfer eligibility.
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <strong>Note:</strong> &ldquo;The asking price represents the components specified by the seller. Any tenancy/lease continuation is subject to the landlord&apos;s approval and applicable agreement.&rdquo;
                </p>
              </div>

              {/* SECTION 14: "WHAT AM I BUYING?" (PROMINENT SECTION) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-600/30 shadow-lg space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Section Header */}
                <div className="border-b border-slate-100 pb-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
                    <Info className="w-3.5 h-3.5 text-sky-600" />
                    <span>Transaction Transparency</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    WHAT AM I BUYING?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Rentals Kenya connects Airbnb sellers with buyers. Review the four transaction pillars below:
                  </p>
                </div>

                {/* 1. ASSETS INCLUDED */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                      1
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                      ASSETS INCLUDED
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The sale includes the furniture, appliances, electronics, kitchen equipment, décor and items listed below:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {inventoryItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-800"
                      >
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. TENANCY / LEASE */}
                <div className="space-y-3 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xs">
                      2
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                      TENANCY / LEASE
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    &ldquo;The unit is occupied under a rental/tenancy arrangement. The buyer may continue with the tenancy subject to the landlord&apos;s approval and the applicable tenancy agreement.&rdquo;
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Monthly Rent</span>
                      <div className="text-base font-black text-slate-900 mt-0.5">
                        {formatKES(monthlyRent)}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Security Deposit</span>
                      <div className="text-base font-black text-slate-900 mt-0.5">
                        {formatKES(landlordDeposit)}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Lease Transfer</span>
                      <div className="text-xs font-bold text-sky-700 mt-1">
                        Subject to landlord confirmation
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. AIRBNB OPERATIONS */}
                <div className="space-y-3 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                      3
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                      AIRBNB OPERATIONS
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Where applicable, operational elements provided with this unit include:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs font-semibold text-slate-800">
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Furnished Airbnb-ready setup</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs font-semibold text-slate-800">
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Standard operating turnover procedures (SOPs)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs font-semibold text-slate-800">
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Verified professional cleaning & laundry contacts</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs font-semibold text-slate-800">
                      <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Complete operating inventory handover checklist</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                    <strong>Platform Policy Notice:</strong> Do NOT automatically assume that the existing Airbnb platform user account, reviews, ratings, or Superhost profile transfer to the buyer. Any platform arrangement must comply with Airbnb’s terms of service and applicable local regulations.
                  </div>
                </div>

                {/* 4. NOT INCLUDED */}
                <div className="space-y-3 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xs">
                      4
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
                      NOT INCLUDED
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The following items and assets are strictly NOT part of this sale:
                  </p>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span><strong>Underlying apartment real estate ownership:</strong> The property building belongs to the building owner/landlord.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span><strong>Landlord&apos;s property:</strong> Permanent structural fixtures, borehole infrastructure, common areas.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span><strong>Seller&apos;s personal belongings:</strong> Items excluded from the verified inventory list.</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                      <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span><strong>Airbnb platform account:</strong> Unless explicitly stated, permitted by platform policy, and legally transferred.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Performance Forecasts */}
              <div className="bg-gradient-to-br from-brand-navy to-brand-royal rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">
                        Operating Forecast & Projections
                      </h3>
                      <p className="text-xs text-sky-200">
                        Indicative performance model for short-term rental operation
                      </p>
                    </div>
                  </div>

                  {property.estRoiPercentage && (
                    <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-sm self-start sm:self-auto">
                      ~{property.estRoiPercentage}% Projected Net ROI
                    </div>
                  )}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-brand-surface/70 p-4 rounded-2xl border border-white/10">
                    <span className="text-[11px] text-sky-200 uppercase font-semibold">
                      Est. Nightly Rate
                    </span>
                    <div className="text-lg sm:text-xl font-black text-white mt-1">
                      {formatKES(property.estNightlyRate || 4500)}
                    </div>
                    <span className="text-[10px] text-slate-400">{property.neighbourhood} benchmark</span>
                  </div>

                  <div className="bg-brand-surface/70 p-4 rounded-2xl border border-white/10">
                    <span className="text-[11px] text-sky-200 uppercase font-semibold">
                      Est. Monthly Gross
                    </span>
                    <div className="text-lg sm:text-xl font-black text-emerald-400 mt-1">
                      {formatKES(property.estMonthlyIncome || 85000)}
                    </div>
                    <span className="text-[10px] text-slate-400">At ~{property.estOccupancyRate || 70}% occupancy</span>
                  </div>

                  <div className="bg-brand-surface/70 p-4 rounded-2xl border border-white/10">
                    <span className="text-[11px] text-sky-200 uppercase font-semibold">
                      Est. Annual Gross
                    </span>
                    <div className="text-lg sm:text-xl font-black text-white mt-1">
                      {formatKES(property.estAnnualIncome || 1020000)}
                    </div>
                    <span className="text-[10px] text-slate-400">Before operating expenses</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-[11px] text-amber-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>ESTIMATES ONLY — ACTUAL PERFORMANCE MAY VARY:</strong> Financial projections are modeled from current market averages and historical hospitality performance. Rentals Kenya does not guarantee rental yield, fixed occupancy, or future earnings.
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Setup Overview & Features
                </h3>
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Building & Unit Amenities
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {property.amenities.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                    >
                      {renderAmenityIcon(item.amenity.icon)}
                      <span>{item.amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Action Sidebar (Gated Enquiry & Viewing Forms) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Enquiry Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Enquire on this Setup
                  </h3>
                  <p className="text-xs text-slate-500">
                    Submit a direct verified inquiry or discuss takeover terms with our team.
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Rentals Kenya</span>
                  </a>

                  <a
                    href={`tel:${settings.phone_number}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call Us: {settings.phone_number}</span>
                  </a>
                </div>

                {/* Gated Inquiry Form */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Property Enquiry
                  </h4>
                  <EnquiryForm
                    propertyId={property.id}
                    propertyTitle={property.title}
                    propertyLocation={property.neighbourhood}
                    whatsappNumber={settings.whatsapp_number}
                  />
                </div>
              </div>

              {/* Private Viewing Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>Book Private On-Site Inspection</span>
                </div>
                <p className="text-xs text-slate-500 leading-snug">
                  Select your preferred date and time to inspect the physical inventory, building amenities, and tenancy terms in person.
                </p>
                <ViewingForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                  propertyLocation={property.neighbourhood}
                />
              </div>
            </aside>
          </div>
        </div>

        {/* Sticky Mobile Contact Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 flex items-center justify-between gap-3 lg:hidden shadow-2xl">
          <div>
            <div className="text-xs text-slate-500">Asking Price</div>
            <div className="text-base font-extrabold text-slate-900">
              {formatKES(totalAskingPrice)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${settings.phone_number}`}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200"
              aria-label="Call Rentals Kenya"
            >
              <Phone className="w-4 h-4" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
