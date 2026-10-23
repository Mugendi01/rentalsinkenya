'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatKES } from '@/lib/formatters';
import {
  Building2,
  DollarSign,
  Sparkles,
  CheckSquare,
  Image as ImageIcon,
  Globe,
  ArrowRight,
  ArrowLeft,
  Upload,
  Trash2,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
} from 'lucide-react';

interface PropertyFormProps {
  initialData?: any;
  isEdit?: boolean;
}

interface PropertyFormState {
  title: string;
  slug: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: string | number;
  furnishing: string;
  county: string;
  town: string;
  neighbourhood: string;
  address: string;
  price: number;
  currency: string;
  isAirbnbReady: boolean;
  isFeatured: boolean;
  status: string;
  estNightlyRate: number;
  estOccupancyRate: number;
  estMonthlyIncome: number;
  estAnnualIncome: number;
  estRoiPercentage: number;
  serviceCharge: number;
  managementFee: number;
  investmentNotes: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  amenities: string[];
  images: string[];
}

export default function PropertyForm({ initialData, isEdit = false }: PropertyFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Amenities from backend
  const [availableAmenities, setAvailableAmenities] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState<PropertyFormState>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    propertyType: initialData?.propertyType || 'Apartment',
    bedrooms: initialData?.bedrooms !== undefined ? initialData.bedrooms : 1,
    bathrooms: initialData?.bathrooms !== undefined ? initialData.bathrooms : 1,
    sizeSqft: initialData?.sizeSqft || '',
    furnishing: initialData?.furnishing || 'Furnished',
    county: initialData?.county || 'Nairobi',
    town: initialData?.town || 'Nairobi',
    neighbourhood: initialData?.neighbourhood || 'Kilimani',
    address: initialData?.address || '',
    price: initialData?.price || 6500000,
    currency: 'KES',
    isAirbnbReady: initialData?.isAirbnbReady !== undefined ? initialData.isAirbnbReady : true,
    isFeatured: initialData?.isFeatured || false,
    status: initialData?.status || 'AVAILABLE',
    estNightlyRate: initialData?.estNightlyRate || 4500,
    estOccupancyRate: initialData?.estOccupancyRate || 70,
    estMonthlyIncome: initialData?.estMonthlyIncome || 85000,
    estAnnualIncome: initialData?.estAnnualIncome || 1020000,
    estRoiPercentage: initialData?.estRoiPercentage || 15.0,
    serviceCharge: initialData?.serviceCharge || 6500,
    managementFee: initialData?.managementFee || 15,
    investmentNotes: initialData?.investmentNotes || '',
    featuredImage: initialData?.featuredImage || '',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    amenities: (initialData?.amenities?.map((a: any) => a.amenityId || a.id) || []) as string[],
    images: (initialData?.images?.map((img: any) => img.imageUrl) || [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ]) as string[],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load amenities list
  useEffect(() => {
    fetch('/api/amenities')
      .then((res) => res.json())
      .then((data) => {
        if (data.amenities) setAvailableAmenities(data.amenities);
      })
      .catch(console.error);
  }, []);

  // Auto-generate slug from title if new
  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isEdit ? prev.slug : generatedSlug,
    }));
  };

  // Auto-calculate financial forecasts when price, nightly rate, or occupancy changes
  const handleFinancialRecalc = (nightly: number, occ: number, prc: number) => {
    const monthlyGross = Math.round((occ / 100) * 30.4 * nightly);
    const annualGross = monthlyGross * 12;
    const roi = prc > 0 ? ((annualGross / prc) * 100).toFixed(1) : '0';

    setFormData((prev) => ({
      ...prev,
      estNightlyRate: nightly,
      estOccupancyRate: occ,
      price: prc,
      estMonthlyIncome: monthlyGross,
      estAnnualIncome: annualGross,
      estRoiPercentage: parseFloat(roi),
    }));
  };

  // Toggle amenity selection
  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenityId);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((id: string) => id !== amenityId)
          : [...prev.amenities, amenityId],
      };
    });
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  // Handle local file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError(null);

    try {
      const file = files[0];
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, json.url],
      }));
    } catch (err: any) {
      setError(err.message || 'Image upload error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index),
    }));
  };

  // Set as primary image
  const handleSetPrimaryImage = (index: number) => {
    const selected = formData.images[index];
    const rest = formData.images.filter((_: string, i: number) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: [selected, ...rest],
      featuredImage: selected,
    }));
  };

  // Submit Handler
  const handleSubmit = async (targetStatus?: string) => {
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      status: targetStatus || formData.status,
      featuredImage: formData.images[0] || null,
      sizeSqft: formData.sizeSqft ? parseInt(formData.sizeSqft.toString()) : null,
      bedrooms: parseInt(formData.bedrooms.toString()),
      bathrooms: parseFloat(formData.bathrooms.toString()),
      price: parseFloat(formData.price.toString()),
      estNightlyRate: formData.estNightlyRate ? parseFloat(formData.estNightlyRate.toString()) : null,
      estOccupancyRate: formData.estOccupancyRate ? parseFloat(formData.estOccupancyRate.toString()) : null,
      estMonthlyIncome: formData.estMonthlyIncome ? parseFloat(formData.estMonthlyIncome.toString()) : null,
      estAnnualIncome: formData.estAnnualIncome ? parseFloat(formData.estAnnualIncome.toString()) : null,
      estRoiPercentage: formData.estRoiPercentage ? parseFloat(formData.estRoiPercentage.toString()) : null,
      serviceCharge: formData.serviceCharge ? parseFloat(formData.serviceCharge.toString()) : null,
      managementFee: formData.managementFee ? parseFloat(formData.managementFee.toString()) : null,
    };

    try {
      const url = isEdit ? `/api/properties/${initialData.id}` : '/api/properties';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save property');

      router.push('/admin/properties');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving');
      setStep(5); // Jump to last step so user sees error
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Basic Details', icon: Building2 },
    { num: 2, label: 'Pricing & Yield', icon: DollarSign },
    { num: 3, label: 'Amenities', icon: CheckSquare },
    { num: 4, label: 'Images & Media', icon: ImageIcon },
    { num: 5, label: 'Review & Publish', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Wizard Progress Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-5 gap-2 text-center">
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`py-2 px-1 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  isCurrent
                    ? 'bg-brand-navy text-sky-400 shadow-md'
                    : isCompleted
                    ? 'bg-slate-100 text-emerald-700'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden md:inline">{s.label}</span>
                <span className="md:hidden">Step {s.num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: BASIC DETAILS & LOCATION */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Step 1: Property Identification & Location
            </h2>
            <p className="text-xs text-slate-500">
              Provide key specifications and regional placement.
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Property Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Modern 1-Bedroom Airbnb Haven with Rooftop Heated Pool"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                URL Slug <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400">
                Will be accessible at: /properties/{formData.slug || 'property-slug'}
              </span>
            </div>

            {/* Property Type, Bedrooms, Bathrooms, Size */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Studio">Studio</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Size (Sqft)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 650"
                  value={formData.sizeSqft}
                  onChange={(e) => setFormData({ ...formData, sizeSqft: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* Location Fields: County, Town, Suburb, Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  County
                </label>
                <input
                  type="text"
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  placeholder="e.g. Nairobi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Town / City
                </label>
                <input
                  type="text"
                  value={formData.town}
                  onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                  placeholder="e.g. Nairobi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Neighbourhood / Suburb <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.neighbourhood}
                  onChange={(e) => setFormData({ ...formData, neighbourhood: e.target.value })}
                  placeholder="e.g. Kilimani, Westlands, Diani"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Specific Address / Road Name
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Argwings Kodhek Road, Off Chania Avenue"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Description & Investor Overview <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail the property layout, interior design package, expected guests, and architectural highlights..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-royal text-white font-bold text-xs shadow transition-all"
            >
              <span>Next: Pricing & Yield</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PRICING & AIRBNB INVESTMENT FORECASTS */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Step 2: Pricing & Airbnb Yield Forecasts
            </h2>
            <p className="text-xs text-slate-500">
              Set purchase price and projected short-term rental performance metrics.
            </p>
          </div>

          <div className="space-y-5">
            {/* Price & Airbnb Ready Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Asking Price (KES) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={formData.price}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    handleFinancialRecalc(formData.estNightlyRate, formData.estOccupancyRate, val);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-extrabold text-slate-900"
                />
                <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                  Formatted: {formatKES(formData.price)}
                </span>
              </div>

              <div className="flex flex-col justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAirbnbReady}
                    onChange={(e) => setFormData({ ...formData, isAirbnbReady: e.target.checked })}
                    className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-500" />
                      Mark as "Airbnb Ready"
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Displays verified badge on property cards and details page.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Nightly Rate, Occupancy, Service Charge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Est. Nightly Rate (KES)
                </label>
                <input
                  type="number"
                  step="500"
                  value={formData.estNightlyRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    handleFinancialRecalc(val, formData.estOccupancyRate, formData.price);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500">e.g. 4,500 KES/night</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Est. Occupancy (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={formData.estOccupancyRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    handleFinancialRecalc(formData.estNightlyRate, val, formData.price);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500">Benchmark: 65% - 75%</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Monthly Service Charge (KES)
                </label>
                <input
                  type="number"
                  step="500"
                  value={formData.serviceCharge}
                  onChange={(e) => setFormData({ ...formData, serviceCharge: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500">Security, generator, lifts</span>
              </div>
            </div>

            {/* Auto-Calculated Projections Box */}
            <div className="bg-brand-navy text-white p-5 rounded-2xl border border-brand-royal space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                Live Projections Preview
              </span>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2.5 bg-brand-surface/70 rounded-xl border border-white/10">
                  <div className="text-base sm:text-lg font-black text-emerald-400">
                    {formatKES(formData.estMonthlyIncome)}
                  </div>
                  <span className="text-[10px] text-slate-300">Est. Monthly Gross</span>
                </div>

                <div className="p-2.5 bg-brand-surface/70 rounded-xl border border-white/10">
                  <div className="text-base sm:text-lg font-black text-white">
                    {formatKES(formData.estAnnualIncome)}
                  </div>
                  <span className="text-[10px] text-slate-300">Est. Annual Gross</span>
                </div>

                <div className="p-2.5 bg-brand-surface/70 rounded-xl border border-white/10">
                  <div className="text-base sm:text-lg font-black text-sky-300">
                    ~{formData.estRoiPercentage}%
                  </div>
                  <span className="text-[10px] text-slate-300">Est. Gross Yield</span>
                </div>
              </div>
            </div>

            {/* Investment Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Advisor Notes / Commentary
              </label>
              <textarea
                rows={2}
                value={formData.investmentNotes}
                onChange={(e) => setFormData({ ...formData, investmentNotes: e.target.value })}
                placeholder="Add special notes on rental velocity, seasonality, or corporate tenant profiles..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-royal text-white font-bold text-xs shadow transition-all"
            >
              <span>Next: Amenities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AMENITIES CHECKBOXES */}
      {step === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Step 3: Select Building & Apartment Amenities
            </h2>
            <p className="text-xs text-slate-500">
              Click checkboxes to toggle features included in this property.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableAmenities.map((amenity) => {
              const isSelected = formData.amenities.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 text-brand-navy font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs">{amenity.name}</span>
                  {isSelected ? (
                    <CheckCircle className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-royal text-white font-bold text-xs shadow transition-all"
            >
              <span>Next: Images & Media</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: IMAGES & MEDIA */}
      {step === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Step 4: Upload & Organize Property Photography
            </h2>
            <p className="text-xs text-slate-500">
              Upload local photos or paste high-resolution URLs. The first image is the primary cover image.
            </p>
          </div>

          {/* Uploader / URL input */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                placeholder="Paste Image URL (https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Add Image URL
              </button>

              {/* Local File Upload Button */}
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer transition-colors shadow">
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Images Grid Preview */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase">
              Current Photos ({formData.images.length})
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.images.map((url, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 bg-slate-100 group shadow-sm ${
                    idx === 0 ? 'border-sky-500 ring-2 ring-sky-400/30' : 'border-slate-200'
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Property photo ${idx + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />

                  {idx === 0 && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-sky-500 text-slate-950 text-[10px] font-black uppercase shadow">
                      Cover Photo
                    </div>
                  )}

                  {/* Overlay Action Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-[10px] font-bold"
                        title="Set as Primary Cover"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-royal text-white font-bold text-xs shadow transition-all"
            >
              <span>Next: SEO & Publish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW, SEO & PUBLISHING */}
      {step === 5 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Step 5: SEO, Marketing Status & Publishing
            </h2>
            <p className="text-xs text-slate-500">
              Configure publication state, meta tags, and preview before launching.
            </p>
          </div>

          <div className="space-y-4">
            {/* Status & Featured Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Listing Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                >
                  <option value="AVAILABLE">AVAILABLE (Live in search)</option>
                  <option value="SOLD">SOLD (Visible as sold demo)</option>
                  <option value="RESERVED">RESERVED (Under contract)</option>
                  <option value="COMING_SOON">COMING SOON</option>
                  <option value="HIDDEN">HIDDEN / DRAFT (Admin only)</option>
                </select>
              </div>

              <div className="flex flex-col justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      ★ Mark as Featured Property
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Pin to homepage "Featured Properties" carousel.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* SEO Title & Description */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Custom SEO Meta Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder={formData.title ? `${formData.title} | Rentals Kenya` : ''}
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Custom SEO Meta Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Target search terms like '1 Bedroom Airbnb Kilimani'..."
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Live Summary Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Summary Overview:
              </span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-slate-600">
                <span><strong>Title:</strong> {formData.title || 'Untitled'}</span>
                <span><strong>Location:</strong> {formData.neighbourhood}, {formData.county}</span>
                <span><strong>Price:</strong> {formatKES(formData.price)}</span>
                <span><strong>Type:</strong> {formData.bedrooms} Bed {formData.propertyType}</span>
                <span><strong>Yield:</strong> ~{formData.estRoiPercentage}% ROI</span>
                <span><strong>Amenities:</strong> {formData.amenities.length} selected</span>
                <span><strong>Photos:</strong> {formData.images.length} images</span>
              </div>
            </div>
          </div>

          {/* Final Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit('HIDDEN')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                Save as Draft
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit('AVAILABLE')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{isEdit ? 'Update & Save Changes' : 'Publish Property Listing'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
