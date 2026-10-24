'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, Bed, DollarSign, Sparkles, Home } from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  // 'rentals' (Primary: rental apartments & houses) or 'airbnb' (Secondary: Airbnb business takeovers & furnished setups)
  const [searchMode, setSearchMode] = useState<'rentals' | 'airbnb'>('rentals');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchMode === 'rentals') {
      // Primary: Rental Houses & Apartments
      if (type) {
        params.set('type', type);
      }
      if (location) params.set('location', location);
      if (bedrooms) params.set('bedrooms', bedrooms);
      if (maxPrice) params.set('maxPrice', maxPrice);

      // If user is already on homepage, smoothly scroll to rental listings
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        const el = document.getElementById('rental-listings') || document.getElementById('houses-for-rent');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      router.push(`/properties?${params.toString()}`);
    } else {
      // Secondary: Airbnb Business Takeovers
      params.set('isAirbnbReady', 'true');
      if (type) params.set('type', type);
      if (location) params.set('location', location);
      if (bedrooms) params.set('bedrooms', bedrooms);
      if (maxPrice) params.set('maxPrice', maxPrice);

      router.push(`/properties?${params.toString()}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Search Mode Segmented Switch: Rental Houses & Apartments (Primary) vs Airbnb Takeovers (Secondary) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-2 mb-3 px-1 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => {
            setSearchMode('rentals');
            setType('');
            setMaxPrice('');
          }}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all w-full sm:w-auto ${
            searchMode === 'rentals'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
              : 'bg-white/10 text-white/90 hover:bg-white/15 border border-white/15 backdrop-blur-md'
          }`}
        >
          <Home className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Houses & Apartments for Rent</span>
          <span
            className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-black flex-shrink-0 ${
              searchMode === 'rentals'
                ? 'bg-slate-950 text-emerald-300'
                : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
            }`}
          >
            Primary
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSearchMode('airbnb');
            setType('');
            setMaxPrice('');
          }}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all w-full sm:w-auto ${
            searchMode === 'airbnb'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
              : 'bg-white/10 text-white/90 hover:bg-white/15 border border-white/15 backdrop-blur-md'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Airbnb Business Takeovers</span>
          <span
            className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
              searchMode === 'airbnb'
                ? 'bg-slate-950 text-amber-300'
                : 'bg-white/10 text-slate-300 border border-white/20'
            }`}
          >
            For Sale
          </span>
        </button>
      </div>

      {/* Main Search Card */}
      <form
        onSubmit={handleSearch}
        className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Location */}
          <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 text-left">
            <label className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sky-500" />
              <span>Target Location</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Target Location"
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">All Kenya Markets</option>
              <option value="Kilimani">Kilimani, Nairobi</option>
              <option value="Westlands">Westlands, Nairobi</option>
              <option value="Kileleshwa">Kileleshwa, Nairobi</option>
              <option value="Lavington">Lavington, Nairobi</option>
              <option value="Ruaka">Ruaka, Kiambu</option>
              <option value="Diani">Diani Beach, Kwale</option>
              <option value="Naivasha">Naivasha, Nakuru</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 text-left">
            <label className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <Building className="w-3 h-3 text-sky-500" />
              <span>Property Type</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Property Type"
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {searchMode === 'rentals' ? (
                <>
                  <option value="">All Rental Types</option>
                  <option value="Apartment">Rental Apartment</option>
                  <option value="Studio">Rental Studio</option>
                  <option value="Villa">Townhouse / Villa / House</option>
                  <option value="Penthouse">Rental Penthouse</option>
                </>
              ) : (
                <>
                  <option value="">Any Airbnb Property Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Studio">Studio</option>
                  <option value="Villa">Villa / Holiday Home</option>
                  <option value="Penthouse">Penthouse</option>
                </>
              )}
            </select>
          </div>

          {/* Bedrooms */}
          <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 text-left">
            <label className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <Bed className="w-3 h-3 text-sky-500" />
              <span>Bedrooms</span>
            </label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              aria-label="Bedrooms"
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1 Bedroom / Studio</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
            </select>
          </div>

          {/* Max Budget & Search Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 p-2 sm:p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 text-left">
              <label className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-sky-500" />
                <span>
                  {searchMode === 'rentals' ? 'Monthly Rent' : 'Takeover Budget'}
                </span>
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                aria-label="Budget"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {searchMode === 'rentals' ? (
                  <>
                    <option value="">No Limit</option>
                    <option value="35000">Up to KES 35K/mo</option>
                    <option value="65000">Up to KES 65K/mo</option>
                    <option value="100000">Up to KES 100K/mo</option>
                    <option value="150000">Up to KES 150K/mo</option>
                    <option value="250000">Up to KES 250K/mo</option>
                  </>
                ) : (
                  <>
                    <option value="">No Limit</option>
                    <option value="5000000">KES 5.0M</option>
                    <option value="8000000">KES 8.0M</option>
                    <option value="15000000">KES 15.0M</option>
                    <option value="25000000">KES 25.0M</option>
                  </>
                )}
              </select>
            </div>

            <button
              type="submit"
              className={`w-full sm:w-auto h-auto sm:h-full px-5 py-3 sm:py-3.5 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] sm:hover:scale-105 active:scale-95 ${
                searchMode === 'rentals'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
              }`}
              aria-label="Submit search"
            >
              <Search className="w-4 h-4 text-slate-950 flex-shrink-0" />
              <span className="text-xs font-black whitespace-nowrap">
                {searchMode === 'rentals' ? 'Search Rentals' : 'Search Takeovers'}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Context Hint Strip */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1 gap-2">
          {searchMode === 'rentals' ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>
                <strong>Primary Business:</strong> Move-in ready apartments & houses for rent.{' '}
                <a href="#rental-listings" className="text-sky-600 font-bold hover:underline">
                  Browse rental listings below &darr;
                </a>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>
                <strong>Secondary Offering:</strong> Turnkey Airbnb setups including furniture, appliances, inventory, and transferable tenancy.
              </span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-3 text-slate-400">
            <span>Verified Landlords</span>
            <span>•</span>
            <span>Direct Lease Transfer</span>
            <span>•</span>
            <span>Advocate-Backed</span>
          </div>
        </div>
      </form>
    </div>
  );
}
