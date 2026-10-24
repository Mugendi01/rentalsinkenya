'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw, Sparkles, ChevronDown } from 'lucide-react';

interface PropertyFiltersProps {
  locations?: { name: string; slug: string }[];
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export default function PropertyFilters({
  locations = [],
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Current values from URL
  const selectedLocation = searchParams.get('location') || '';
  const selectedType = searchParams.get('type') || '';
  const selectedBedrooms = searchParams.get('bedrooms') || '';
  const selectedMinPrice = searchParams.get('minPrice') || '';
  const selectedMaxPrice = searchParams.get('maxPrice') || '';
  const isAirbnbReady = searchParams.get('isAirbnbReady') === 'true';
  const isFurnished = searchParams.get('isFurnished') === 'true';
  const selectedSort = searchParams.get('sortBy') || 'newest';

  const activeFilterCount = [
    Boolean(selectedLocation),
    Boolean(selectedType),
    Boolean(selectedBedrooms),
    Boolean(selectedMinPrice),
    Boolean(selectedMaxPrice),
    isAirbnbReady,
    isFurnished,
  ].filter(Boolean).length;

  const updateParam = (key: string, value: string | boolean | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '' || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    // Always reset page if pagination is implemented
    params.delete('page');
    router.push(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/properties');
    if (onCloseMobileDrawer) onCloseMobileDrawer();
  };

  const propertyTypes = ['Apartment', 'Studio', 'Villa', 'Penthouse', 'Townhouse'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4 lg:space-y-6">
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
            <span>Filter & Sort Properties</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-[11px] font-medium">{mobileOpen ? 'Hide' : 'Show'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-sky-600" />
          <span>Filter Properties</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Collapsible Content on Mobile, Always Visible on Desktop */}
      <div className={`${mobileOpen ? 'block' : 'hidden lg:block'} space-y-5 pt-2 lg:pt-0`}>

      {/* Location */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Location / Suburb
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => updateParam('location', e.target.value)}
          aria-label="Location or Suburb"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">All Locations in Kenya</option>
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
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Property Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => updateParam('type', e.target.value)}
          aria-label="Property Type"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">All Property Types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Bedrooms
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {['', '1', '2', '3'].map((bed) => {
            const isSelected = selectedBedrooms === bed;
            const label = bed === '' ? 'Any' : bed === '3' ? '3+' : `${bed}`;
            return (
              <button
                key={bed}
                type="button"
                onClick={() => updateParam('bedrooms', bed === '' ? null : bed)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-brand-navy border-brand-navy text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Price Range (KES)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={selectedMinPrice}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            aria-label="Minimum Price (KES)"
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Min Price</option>
            <option value="4000000">KES 4.0M</option>
            <option value="6000000">KES 6.0M</option>
            <option value="10000000">KES 10.0M</option>
            <option value="15000000">KES 15.0M</option>
          </select>
          <select
            value={selectedMaxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            aria-label="Maximum Price (KES)"
            className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Max Price</option>
            <option value="7000000">KES 7.0M</option>
            <option value="12000000">KES 12.0M</option>
            <option value="20000000">KES 20.0M</option>
            <option value="35000000">KES 35.0M+</option>
          </select>
        </div>
      </div>

      {/* Checkbox Toggles */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isAirbnbReady}
            onChange={(e) => updateParam('isAirbnbReady', e.target.checked)}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
          />
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Airbnb Ready Only
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isFurnished}
            onChange={(e) => updateParam('isFurnished', e.target.checked)}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
          />
          <span className="text-xs font-semibold text-slate-800">
            Fully Furnished Only
          </span>
        </label>
      </div>

      {/* Sort By */}
      <div className="pt-3 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Sort Results
        </label>
        <select
          value={selectedSort}
          onChange={(e) => updateParam('sortBy', e.target.value)}
          aria-label="Sort Results"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
        >
          <option value="newest">Newest First</option>
          <option value="roi_desc">Highest Projected ROI</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {isMobileDrawer && (
        <button
          type="button"
          onClick={onCloseMobileDrawer}
          className="w-full py-3 rounded-xl bg-brand-navy text-white font-bold text-sm"
        >
          Apply Filters
        </button>
      )}
      </div>
    </div>
  );
}
