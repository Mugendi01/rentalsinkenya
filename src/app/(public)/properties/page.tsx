import React from 'react';
import prisma from '@/lib/prisma';
import { getSiteSettings } from '@/lib/settings';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilters from '@/components/properties/PropertyFilters';
import { Building2, SearchX, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

interface PropertiesPageProps {
  searchParams: {
    location?: string;
    type?: string;
    bedrooms?: string;
    minPrice?: string;
    maxPrice?: string;
    isAirbnbReady?: string;
    isFurnished?: string;
    sortBy?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const settings = await getSiteSettings();

  const {
    location,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    isAirbnbReady,
    isFurnished,
    sortBy = 'newest',
  } = searchParams;

  // Build Prisma where clause
  const where: any = {
    status: { not: 'HIDDEN' },
  };

  if (location) {
    where.OR = [
      { neighbourhood: { contains: location } },
      { town: { contains: location } },
      { county: { contains: location } },
    ];
  }

  if (type) {
    where.propertyType = { equals: type };
  }

  if (bedrooms) {
    const bedCount = parseInt(bedrooms);
    if (bedCount >= 3) {
      where.bedrooms = { gte: 3 };
    } else if (bedCount > 0) {
      where.bedrooms = { equals: bedCount };
    }
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (isAirbnbReady === 'true') {
    where.isAirbnbReady = true;
  }

  if (isFurnished === 'true') {
    where.furnishing = { in: ['Furnished', 'Fully Furnished'] };
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'price_asc') {
    orderBy = { price: 'asc' };
  } else if (sortBy === 'price_desc') {
    orderBy = { price: 'desc' };
  } else if (sortBy === 'roi_desc') {
    orderBy = { estRoiPercentage: 'desc' };
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy,
    include: {
      images: {
        orderBy: { displayOrder: 'asc' },
        take: 1,
      },
    },
  });

  const locationsList = await prisma.location.findMany({
    select: { name: true, slug: true },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Property Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Available Properties in Kenya
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Browse rental apartments, residential houses, and turnkey Airbnb business takeovers across prime Kenyan markets.
          </p>
        </div>

        {/* Layout: Sidebar Filter + Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24">
            <PropertyFilters locations={locationsList} />
          </aside>

          {/* Results Area */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Results count bar */}
            <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200/80 text-xs text-slate-600 shadow-sm">
              <div>
                Showing <strong className="text-slate-900">{properties.length}</strong> {properties.length === 1 ? 'investment property' : 'investment properties'}
                {location && (
                  <span> in <span className="text-sky-600 font-bold">{location}</span></span>
                )}
              </div>
              <span className="hidden sm:inline text-slate-400">
                All prices quoted in Kenyan Shillings (KES)
              </span>
            </div>

            {/* Properties Grid */}
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    whatsappNumber={settings.whatsapp_number}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <SearchX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No Properties Match Your Filters
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try widening your price range or clearing some filters to see available investment units across Nairobi and other Kenyan hubs.
                </p>
                <div className="pt-2">
                  <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-royal text-white text-xs font-bold transition-all shadow"
                  >
                    Clear All Filters
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
