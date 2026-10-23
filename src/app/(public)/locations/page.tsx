import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import type { Location } from '@prisma/client';
import { Compass, ArrowRight, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Strategic Kenyan Property Investment Locations | Rentals Kenya',
  description:
    'Explore high-performing real estate and Airbnb investment locations across Kenya: Kilimani, Westlands, Kileleshwa, Diani Beach, Ruaka, and Naivasha.',
};

export default async function LocationsPage() {
  let locations: Location[] = [];
  const locationCounts: Record<string, number> = {};

  try {
    locations = await prisma.location.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    // Count properties per location
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
    console.warn('Error fetching locations:', error);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Market Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Strategic Property Investment Locations in Kenya
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Detailed insights into Kenya’s most lucrative real estate corridors. Browse available turnkey units and understand location-specific occupancy drivers.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((loc) => {
            const count = locationCounts[loc.name] || 0;
            return (
              <div
                key={loc.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={loc.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                      alt={loc.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-900 shadow">
                        {count} Available {count === 1 ? 'Unit' : 'Units'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-sky-300 font-medium mb-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{loc.county} County</span>
                      </div>
                      <h3 className="text-xl font-black tracking-tight">{loc.name}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {loc.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/properties?location=${encodeURIComponent(loc.name)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-800 text-xs font-bold transition-all"
                  >
                    <span>View Properties in {loc.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
