'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatKES, buildWhatsAppUrl } from '@/lib/formatters';
import {
  Building,
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  Wifi,
  Waves,
  Dumbbell,
  ShieldCheck,
  Zap,
  Droplets,
  Car,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  X,
  Phone,
  Calendar,
  Send,
  Eye,
  Check,
  RotateCcw,
  Camera,
} from 'lucide-react';

export interface RentalPropertyAmenity {
  amenity: {
    id: string;
    name: string;
    icon?: string | null;
  };
}

export interface RentalPropertyItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft?: number | null;
  furnishing: string;
  neighbourhood: string;
  county: string;
  town: string;
  price: number;
  monthlyRent?: number | null;
  landlordDeposit?: number | null;
  status: string;
  featuredImage?: string | null;
  images?: { imageUrl: string }[];
  amenities?: RentalPropertyAmenity[];
}

interface HousesForRentSectionProps {
  properties: RentalPropertyItem[];
  whatsappNumber?: string;
}

export default function HousesForRentSection({
  properties,
  whatsappNumber = '254100382352',
}: HousesForRentSectionProps) {
  // Filter state
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Quick enquiry modal state
  const [enquiryModalProperty, setEnquiryModalProperty] = useState<RentalPropertyItem | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestMoveInDate, setGuestMoveInDate] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [isSubmittingWeb, setIsSubmittingWeb] = useState(false);
  const [webSubmitSuccess, setWebSubmitSuccess] = useState(false);
  const [webSubmitError, setWebSubmitError] = useState<string | null>(null);

  // Extract unique locations for filtering
  const locationsList = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.neighbourhood) set.add(p.neighbourhood);
    });
    return Array.from(set);
  }, [properties]);

  // Compute monthly rent helper
  const getMonthlyRent = (prop: RentalPropertyItem): number => {
    if (prop.monthlyRent && prop.monthlyRent > 0) {
      return prop.monthlyRent;
    }
    // Fallback: if asking price is a takeover figure, calculate typical monthly tenancy
    if (prop.price && prop.price > 1000000) {
      return Math.round(prop.price * 0.007);
    }
    return 45000;
  };

  // Filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        if (selectedType !== 'all') {
          if (selectedType === 'House' || selectedType === 'Villa') {
            if (prop.propertyType !== 'Villa' && prop.propertyType !== 'Townhouse' && prop.propertyType !== 'House') {
              return false;
            }
          } else if (prop.propertyType !== selectedType) {
            return false;
          }
        }

        if (selectedLocation !== 'all' && prop.neighbourhood !== selectedLocation) {
          return false;
        }

        if (selectedBedrooms !== 'all') {
          const beds = parseInt(selectedBedrooms);
          if (selectedBedrooms === '3+' && prop.bedrooms < 3) return false;
          if (selectedBedrooms !== '3+' && prop.bedrooms !== beds) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const rentA = getMonthlyRent(a);
        const rentB = getMonthlyRent(b);
        if (sortBy === 'price_asc') return rentA - rentB;
        if (sortBy === 'price_desc') return rentB - rentA;
        return 0; // default order
      });
  }, [properties, selectedType, selectedLocation, selectedBedrooms, sortBy]);

  // Amenity icon helper
  const renderAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="w-3 h-3 text-sky-500" />;
    if (lower.includes('pool') || lower.includes('swim')) return <Waves className="w-3 h-3 text-sky-500" />;
    if (lower.includes('gym') || lower.includes('fitness')) return <Dumbbell className="w-3 h-3 text-sky-500" />;
    if (lower.includes('security') || lower.includes('cctv') || lower.includes('guard')) {
      return <ShieldCheck className="w-3 h-3 text-emerald-500" />;
    }
    if (lower.includes('generator') || lower.includes('power') || lower.includes('solar')) {
      return <Zap className="w-3 h-3 text-amber-500" />;
    }
    if (lower.includes('water') || lower.includes('borehole')) return <Droplets className="w-3 h-3 text-sky-500" />;
    if (lower.includes('parking') || lower.includes('car')) return <Car className="w-3 h-3 text-slate-500" />;
    return <Check className="w-3 h-3 text-sky-500" />;
  };

  const handleOpenEnquiryModal = (prop: RentalPropertyItem) => {
    setEnquiryModalProperty(prop);
    const rent = getMonthlyRent(prop);
    setGuestMessage(
      `Hello Rentals Kenya, I am inquiring about renting the ${prop.bedrooms}-bedroom property "${prop.title}" in ${prop.neighbourhood} listed at ${formatKES(rent)}/month. Please let me know its viewing schedule and lease terms.`
    );
    setWebSubmitSuccess(false);
    setWebSubmitError(null);
  };

  const handleSendWhatsAppEnquiry = (prop: RentalPropertyItem) => {
    const rent = getMonthlyRent(prop);
    const text = guestMessage
      ? `${guestMessage}${guestName ? `\n\nName: ${guestName}` : ''}${guestMoveInDate ? `\nTarget Move-in: ${guestMoveInDate}` : ''}`
      : `Hello Rentals Kenya, I am inquiring about renting "${prop.title}" in ${prop.neighbourhood} listed at ${formatKES(rent)}/month. Is it available for tenancy?`;

    const url = buildWhatsAppUrl(whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitWebEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryModalProperty) return;

    setIsSubmittingWeb(true);
    setWebSubmitError(null);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: enquiryModalProperty.id,
          fullName: guestName || 'Prospective Tenant',
          phone: guestPhone || '+254100382352',
          email: guestEmail || 'tenant@rentals.ke',
          preferredContact: 'WHATSAPP',
          investmentPurpose: 'PERSONAL_RESIDENCE',
          budget: getMonthlyRent(enquiryModalProperty),
          preferredViewingDate: guestMoveInDate || null,
          message: guestMessage,
        }),
      });

      if (res.ok) {
        setWebSubmitSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        // If auth is required, fallback seamlessly to WhatsApp with prefilled message
        if (data.code === 'AUTH_REQUIRED' || res.status === 401) {
          handleSendWhatsAppEnquiry(enquiryModalProperty);
          setWebSubmitSuccess(true);
        } else {
          setWebSubmitError(data.error || 'Failed to submit enquiry. You can also contact us directly via WhatsApp.');
        }
      }
    } catch {
      // In case of network error, launch WhatsApp
      handleSendWhatsAppEnquiry(enquiryModalProperty);
      setWebSubmitSuccess(true);
    } finally {
      setIsSubmittingWeb(false);
    }
  };

  return (
    <section id="rental-listings" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Compatibility Anchor for existing links */}
      <div id="houses-for-rent" className="-translate-y-24" />
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200/80 pb-6">
        <div className="space-y-2 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            <span>Primary Business: Rental Houses & Apartments in Kenya</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-600 hidden sm:inline font-normal">Monthly Rent</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Available Rental Apartments & Houses
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Browse verified, move-in ready rental apartments, studios, villas, and family houses across Kilimani, Westlands, Kileleshwa, and prime Kenyan neighborhoods. Transparent pricing, direct landlord terms, and fast viewings.
          </p>
        </div>

        {/* Quick Help & Stats */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs text-slate-500 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/70 font-semibold text-slate-700">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'Home' : 'Homes'} Available
          </div>
          <span className="text-[11px] text-slate-500">Verified landlord terms & fast viewings</span>
        </div>
      </div>

      {/* 2. INTERACTIVE FILTER CONTROLS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-8 space-y-4">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
            <span>Filter Rental Properties</span>
          </div>

          {(selectedType !== 'all' || selectedLocation !== 'all' || selectedBedrooms !== 'all' || sortBy !== 'featured') && (
            <button
              type="button"
              onClick={() => {
                setSelectedType('all');
                setSelectedLocation('all');
                setSelectedBedrooms('all');
                setSortBy('featured');
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Property Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Property Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by Property Type"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Rental Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">House / Villa</option>
              <option value="Studio">Studio Apartment</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Location / Suburb
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter by Location"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Kenya Locations</option>
              {locationsList.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Bedrooms
            </label>
            <select
              value={selectedBedrooms}
              onChange={(e) => setSelectedBedrooms(e.target.value)}
              aria-label="Filter by Bedrooms"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Any Bedrooms</option>
              <option value="1">1 Bedroom / Studio</option>
              <option value="2">2 Bedrooms</option>
              <option value="3+">3+ Bedrooms</option>
            </select>
          </div>

          {/* Sort By Monthly Rent */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Sort by Rent
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort by Rent"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="featured">Featured First</option>
              <option value="price_asc">Monthly Rent: Low to High</option>
              <option value="price_desc">Monthly Rent: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. PROPERTY CARDS GRID */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No rental properties match your filters</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your location, bedroom count, or property type filters to see available rental houses and apartments.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedType('all');
              setSelectedLocation('all');
              setSelectedBedrooms('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
          >
            Show All Rentals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProperties.map((prop) => {
            const monthlyRent = getMonthlyRent(prop);
            const totalImages = (prop.images && prop.images.length > 0) ? prop.images.length : (prop.featuredImage ? 1 : 0);
            const coverImage =
              prop.featuredImage ||
              (prop.images && prop.images.length > 0 ? prop.images[0].imageUrl : null) ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

            const whatsappMessage = `Hello Rentals Kenya, I am inquiring about renting the ${prop.bedrooms}-bedroom property "${prop.title}" in ${prop.neighbourhood} at ${formatKES(monthlyRent)}/month. Is it available for a viewing?`;
            const cardWhatsAppUrl = buildWhatsAppUrl(whatsappNumber, whatsappMessage);

            // Extract top 4 amenities
            const topAmenities = (prop.amenities || []).slice(0, 4);
            const remainingAmenitiesCount = Math.max(0, (prop.amenities || []).length - 4);

            return (
              <div
                key={prop.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Media Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={coverImage}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Top Left Badges: For Rent & Furnishing */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/95 backdrop-blur-md text-white shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        For Rent
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-navy/90 text-sky-200 backdrop-blur-md border border-sky-400/20">
                        {prop.furnishing || 'Furnished'}
                      </span>
                    </div>

                    {/* Top Right: Property Type */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-md text-slate-800 shadow-sm">
                        {prop.propertyType}
                      </span>
                    </div>

                    {/* Bottom Row on Image: Location & Photos Counter */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-200 drop-shadow">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="truncate font-semibold">
                          {prop.neighbourhood}, {prop.county}
                        </span>
                      </div>

                      {totalImages > 0 && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-medium text-slate-200">
                          <Camera className="w-3 h-3 text-sky-400" />
                          <span>{totalImages} Photos</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    {/* Monthly Rent Header */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          {formatKES(monthlyRent)}
                        </span>
                        <span className="text-xs font-bold text-slate-500 ml-1">/ month</span>
                      </div>

                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        Monthly Tenancy
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/properties/${prop.slug}`}>
                      <h3 className="text-base font-bold text-slate-900 hover:text-sky-600 transition-colors line-clamp-2 leading-snug group-hover:text-brand-navy">
                        {prop.title}
                      </h3>
                    </Link>

                    {/* Key Specs Row */}
                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5" title="Bedrooms">
                        <Bed className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold">{prop.bedrooms} {prop.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="Bathrooms">
                        <Bath className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold">{prop.bathrooms} {prop.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                      </div>
                      {prop.sizeSqft && (
                        <div className="flex items-center gap-1.5" title="Floor Area">
                          <Maximize className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold">{prop.sizeSqft} sqft</span>
                        </div>
                      )}
                    </div>

                    {/* Amenities Chips */}
                    {topAmenities.length > 0 && (
                      <div className="pt-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {topAmenities.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-[11px] font-medium text-slate-600"
                            >
                              {renderAmenityIcon(item.amenity.name)}
                              <span>{item.amenity.name}</span>
                            </span>
                          ))}
                          {remainingAmenitiesCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                              +{remainingAmenitiesCount} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons (Footer) */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Primary Action: Direct WhatsApp Enquiry */}
                    <a
                      href={cardWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Quick Enquiry Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => handleOpenEnquiryModal(prop)}
                      className="px-3 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5 text-sky-600" />
                      <span>Enquire</span>
                    </button>
                  </div>

                  {/* Secondary Action: View Details Page */}
                  <Link
                    href={`/properties/${prop.slug}`}
                    className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-all group-hover:border-slate-300"
                  >
                    <span>View Property Details & Tour</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. FOOTER CALLOUT / REASSURANCE */}
      <div className="mt-12 rounded-3xl bg-slate-100 border border-slate-200/80 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Have a house or apartment you want to lease out in Kenya?</span>
          </h4>
          <p className="text-xs text-slate-600">
            Rentals Kenya connects property owners with qualified tenants and handles lease verification with zero hassle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={buildWhatsAppUrl(whatsappNumber, 'Hello Rentals Kenya, I am a landlord / property owner looking to list a rental apartment or house on your platform.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-royal text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
          >
            List Your Rental Property
          </a>
        </div>
      </div>

      {/* 5. QUICK ENQUIRY POPUP MODAL */}
      {enquiryModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-brand-navy text-white flex items-center justify-between flex-shrink-0">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-sky-400">
                  Rental Tenancy Enquiry
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 mt-0.5">
                  {enquiryModalProperty.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                  <span>{enquiryModalProperty.neighbourhood}, {enquiryModalProperty.county}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">
                    {formatKES(getMonthlyRent(enquiryModalProperty))}/mo
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEnquiryModalProperty(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {webSubmitSuccess ? (
              <div className="p-6 text-center space-y-4 overflow-y-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Enquiry Initiated!</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Thank you! Our leasing team will assist you with viewings, lease agreements, and move-in procedures.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setEnquiryModalProperty(null)}
                    className="px-6 py-2.5 rounded-xl bg-brand-navy text-white font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitWebEnquiry} className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(92vh-90px)]">
                {webSubmitError && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    {webSubmitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Mwangi"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 7XX XXX XXX"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                      Target Move-in Date
                    </label>
                    <input
                      type="date"
                      value={guestMoveInDate}
                      onChange={(e) => setGuestMoveInDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Your Questions / Viewing Request
                  </label>
                  <textarea
                    rows={3}
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppEnquiry(enquiryModalProperty)}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp (Instant)</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingWeb}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand-navy hover:bg-brand-royal text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmittingWeb ? 'Sending...' : 'Send Online'}
                  </button>
                </div>

                <div className="text-center pt-1">
                  <Link
                    href={`/properties/${enquiryModalProperty.slug}`}
                    className="text-[11px] font-semibold text-sky-600 hover:underline"
                  >
                    Or open full property page to see high-res gallery & floor plans &rarr;
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
