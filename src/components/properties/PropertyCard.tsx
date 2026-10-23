import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatKES, buildWhatsAppUrl } from '@/lib/formatters';
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Sparkles,
  TrendingUp,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export interface PropertyCardData {
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
  currency: string;
  isAirbnbReady: boolean;
  isFeatured: boolean;
  status: string;
  estNightlyRate?: number | null;
  estMonthlyIncome?: number | null;
  estRoiPercentage?: number | null;
  featuredImage?: string | null;
  images?: { imageUrl: string }[];
}

interface PropertyCardProps {
  property: PropertyCardData;
  whatsappNumber?: string;
}

export default function PropertyCard({
  property,
  whatsappNumber = '254100382352',
}: PropertyCardProps) {
  const imageUrl =
    property.featuredImage ||
    (property.images && property.images.length > 0 ? property.images[0].imageUrl : null) ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  const isSold = property.status === 'SOLD';
  const isComingSoon = property.status === 'COMING_SOON';
  const isReserved = property.status === 'RESERVED';

  // Customized prefilled WhatsApp message
  const whatsappMsg = `Hello Rentals Kenya, I am interested in "${property.title}" in ${property.neighbourhood} (${formatKES(property.price)}). Please send me more details and financial forecasts.`;
  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, whatsappMsg);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-sky-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Media & Badges */}
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

          {/* Badges: Top Left */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {property.isAirbnbReady && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-navy/90 backdrop-blur-md text-sky-300 border border-sky-400/30 shadow-md">
                <Sparkles className="w-3 h-3 text-sky-400" />
                Airbnb Ready
              </span>
            )}
            {property.isFeatured && !isSold && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/90 backdrop-blur-md text-slate-950 shadow-md">
                Featured
              </span>
            )}
            {isSold && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white uppercase tracking-wider shadow-md">
                Sold
              </span>
            )}
            {isComingSoon && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600/90 text-white">
                Coming Soon
              </span>
            )}
          </div>

          {/* Property Type: Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
              {property.propertyType}
            </span>
          </div>

          {/* Location & Quick ROI Tag on Overlay Bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200 drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              <span className="truncate">
                {property.neighbourhood}, {property.county}
              </span>
            </div>
            {property.estRoiPercentage && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 backdrop-blur-md text-white font-bold text-xs shadow">
                <TrendingUp className="w-3 h-3" />
                <span>{property.estRoiPercentage}% ROI</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Price */}
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {formatKES(property.price)}
              </span>
              <span className="text-xs text-slate-500 ml-1">KES</span>
            </div>
            {property.estMonthlyIncome && (
              <div className="text-right">
                <div className="text-xs font-semibold text-emerald-600">
                  ~{formatKES(property.estMonthlyIncome)}/mo
                </div>
                <div className="text-[10px] text-slate-600 uppercase font-medium">
                  Est. Gross Yield
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/properties/${property.slug}`}>
            <h3 className="text-base font-bold text-slate-800 hover:text-sky-600 transition-colors line-clamp-1 group-hover:text-brand-navy">
              {property.title}
            </h3>
          </Link>

          {/* Key Specs */}
          <div className="flex items-center gap-4 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5" title="Bedrooms">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.bedrooms} Bed{property.bedrooms === 1 ? '' : 's'}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Bathrooms">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.bathrooms} Bath{property.bathrooms === 1 ? '' : 's'}</span>
            </div>
            {property.sizeSqft && (
              <div className="flex items-center gap-1.5" title="Floor Area">
                <Maximize className="w-4 h-4 text-slate-400" />
                <span>{property.sizeSqft} sqft</span>
              </div>
            )}
            <div className="ml-auto text-slate-600 font-medium">
              {property.furnishing}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <Link
          href={`/properties/${property.slug}`}
          className="w-full inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
