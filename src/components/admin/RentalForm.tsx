'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatKES } from '@/lib/formatters';
import {
  Home,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Upload,
  Trash2,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Phone,
  User,
  Mail,
  Calendar,
  Sparkles,
  ArrowLeft,
  FileText,
  SlidersHorizontal,
  Info,
  ExternalLink,
} from 'lucide-react';

interface RentalFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function RentalForm({ initialData, isEdit = false }: RentalFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableAmenities, setAvailableAmenities] = useState<any[]>([]);

  // Parse contact info from initialData
  const initialContact = initialData?.contactInfo || (() => {
    if (initialData?.investmentNotes) {
      try {
        return JSON.parse(initialData.investmentNotes);
      } catch {
        return {};
      }
    }
    return {};
  })();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    propertyType: initialData?.propertyType || 'Apartment',
    bedrooms: initialData?.bedrooms !== undefined ? initialData.bedrooms : 2,
    bathrooms: initialData?.bathrooms !== undefined ? initialData.bathrooms : 2,
    sizeSqft: initialData?.sizeSqft || '',
    furnishing: initialData?.furnishing || 'Furnished',
    county: initialData?.county || 'Nairobi',
    town: initialData?.town || 'Nairobi',
    neighbourhood: initialData?.neighbourhood || 'Kilimani',
    address: initialData?.address || '',
    monthlyRent: initialData?.monthlyRent || (initialData?.price && initialData.price < 500000 ? initialData.price : 65000),
    landlordDeposit: initialData?.landlordDeposit || 65000,
    serviceCharge: initialData?.serviceCharge || 5000,
    leaseTerms: initialData?.leaseTerms || '1-year renewable tenancy lease. 1-month refundable security deposit.',
    contactName: initialContact?.contactName || 'Rentals Kenya Leasing Desk',
    contactPhone: initialContact?.contactPhone || '+254100382352',
    contactEmail: initialContact?.contactEmail || 'rentals@rentals.ke',
    viewingInstructions: initialContact?.viewingInstructions || 'Available for viewings Monday to Saturday 9:00 AM - 5:00 PM with 2 hours advance notice.',
    isFeatured: initialData?.isFeatured || false,
    status: initialData?.status || 'AVAILABLE',
    featuredImage: initialData?.featuredImage || '',
    amenities: (initialData?.amenities?.map((a: any) => a.amenityId || a.amenity?.id || a.id) || []) as string[],
    images: (initialData?.images?.map((img: any) => img.imageUrl) || [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ]) as string[],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch available amenities
  useEffect(() => {
    fetch('/api/amenities')
      .then((res) => res.json())
      .then((data) => {
        if (data.amenities) setAvailableAmenities(data.amenities);
      })
      .catch(console.error);
  }, []);

  // Auto-generate slug from title for new listings
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

  // Toggle amenity selection
  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenityId);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((id) => id !== amenityId)
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
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Set as primary image
  const handleSetPrimaryImage = (index: number) => {
    const selected = formData.images[index];
    const rest = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      featuredImage: selected,
      images: [selected, ...rest],
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        monthlyRent: Number(formData.monthlyRent),
        landlordDeposit: formData.landlordDeposit ? Number(formData.landlordDeposit) : null,
        serviceCharge: formData.serviceCharge ? Number(formData.serviceCharge) : null,
        sizeSqft: formData.sizeSqft ? Number(formData.sizeSqft) : null,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
      };

      const url = isEdit ? `/api/rentals/${initialData.id}` : '/api/rentals';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save rental listing');

      router.push('/admin/rentals');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/rentals"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Rental Listings"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Residential Rental
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">
                {isEdit ? 'Editing Existing Listing' : 'Creating New Listing'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {isEdit ? `Edit: ${formData.title}` : 'Add New Rental Listing'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/rentals"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEdit ? 'Save Changes' : 'Publish Rental Listing'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: PHOTOS & MEDIA */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Rental Photos & Media</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-quality photos of the living room, bedrooms, kitchen, bathrooms, and building exterior.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {formData.images.length} {formData.images.length === 1 ? 'Photo' : 'Photos'}
          </span>
        </div>

        {/* Upload Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500/50 bg-slate-50/50 text-center flex flex-col items-center justify-center space-y-2">
            <Upload className="w-6 h-6 text-slate-400" />
            <div className="text-xs font-bold text-slate-700">Upload Photos from Device</div>
            <p className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 5MB</p>
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors">
              <span>{uploadingImage ? 'Uploading...' : 'Choose File'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-center space-y-2">
            <label className="text-xs font-bold text-slate-700">Or Paste Image URL</label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Add URL
              </button>
            </div>
            <span className="text-[10px] text-slate-400">Direct image link (Unsplash, CDN, etc.)</span>
          </div>
        </div>

        {/* Image Previews */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {formData.images.map((img, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={idx}
                className={`group relative aspect-[4/3] rounded-2xl overflow-hidden border-2 bg-slate-100 ${
                  isPrimary ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                }`}
              >
                <Image
                  src={img}
                  alt={`Photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />

                {isPrimary && (
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[9px] shadow">
                    Cover Photo
                  </div>
                )}

                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      title="Set as Cover Photo"
                      className="p-1.5 rounded-lg bg-white/90 text-slate-900 hover:bg-white text-xs font-bold"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Delete Image"
                    className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: TITLE & PROPERTY SPECS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-600" />
            <span>Listing Details & Specifications</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title */}
          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Listing Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Spacious 2-Bedroom Executive Apartment with Heated Pool"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Property Type */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Property Type *
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">House / Villa</option>
              <option value="Studio">Studio Apartment</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Maisonette">Maisonette</option>
            </select>
          </div>

          {/* Furnishing */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Furnishing Status
            </label>
            <select
              value={formData.furnishing}
              onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Bedrooms *
            </label>
            <select
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="0">Studio (0 Beds)</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Bathrooms *
            </label>
            <select
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="1">1 Bathroom</option>
              <option value="1.5">1.5 Bathrooms</option>
              <option value="2">2 Bathrooms</option>
              <option value="2.5">2.5 Bathrooms</option>
              <option value="3">3 Bathrooms</option>
              <option value="3.5">3.5 Bathrooms</option>
              <option value="4">4+ Bathrooms</option>
            </select>
          </div>
        </div>

        {/* Floor area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Floor Area (Square Feet)
            </label>
            <input
              type="number"
              placeholder="e.g. 1100"
              value={formData.sizeSqft}
              onChange={(e) => setFormData({ ...formData, sizeSqft: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Street / Building Address
            </label>
            <input
              type="text"
              placeholder="e.g. Simba Lane, Off Argwings Kodhek"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: LOCATION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Property Location</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Neighbourhood / Suburb *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kilimani, Westlands, Kileleshwa"
              value={formData.neighbourhood}
              onChange={(e) => setFormData({ ...formData, neighbourhood: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Town / City *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nairobi"
              value={formData.town}
              onChange={(e) => setFormData({ ...formData, town: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              County *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nairobi, Kwale, Kiambu"
              value={formData.county}
              onChange={(e) => setFormData({ ...formData, county: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: MONTHLY RENT & FINANCIAL TERMS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Monthly Rent & Lease Terms</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear monthly pricing displayed directly to prospective tenants in Kenyan Shillings (KES).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/60">
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-950">
              Monthly Rent (KES) *
            </label>
            <input
              type="number"
              required
              min={1000}
              placeholder="e.g. 65000"
              value={formData.monthlyRent}
              onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-base font-black text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              Formatted: {formatKES(formData.monthlyRent)} / mo
            </span>
          </div>

          <div className="space-y-1 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Security Deposit (KES)
            </label>
            <input
              type="number"
              placeholder="e.g. 65000"
              value={formData.landlordDeposit}
              onChange={(e) => setFormData({ ...formData, landlordDeposit: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 block mt-1">Usually 1 or 2 months rent</span>
          </div>

          <div className="space-y-1 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Service Charge (KES / mo)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={formData.serviceCharge}
              onChange={(e) => setFormData({ ...formData, serviceCharge: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 block mt-1">Security, trash, water pumps, lifts</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Lease Terms & Conditions
          </label>
          <input
            type="text"
            placeholder="e.g. Minimum 12-month lease. 1-month rent deposit required. Pets allowed with prior consent."
            value={formData.leaseTerms}
            onChange={(e) => setFormData({ ...formData, leaseTerms: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* SECTION 5: AMENITIES */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Building & Unit Amenities</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select all features available in this rental apartment or house.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {availableAmenities.map((amenity) => {
            const isSelected = formData.amenities.includes(amenity.id);
            return (
              <button
                type="button"
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between text-xs font-semibold ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{amenity.name}</span>
                {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 6: DESCRIPTION */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Property Description *</span>
          </h2>
        </div>

        <textarea
          rows={6}
          required
          placeholder="Describe the unit layout, natural lighting, finishes, balcony views, security, proximity to shopping malls (e.g. Yaya Centre, Sarit Centre), schools, and major roads..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
        />
      </div>

      {/* SECTION 7: CONTACT & ENQUIRY DETAILS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Contact & Viewing Enquiry Details</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal contact and viewing management info for tenant enquiries and WhatsApp leads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Landlord / Leasing Agent
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Kariuki (Property Manager)"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Phone / WhatsApp Number
            </label>
            <input
              type="tel"
              placeholder="e.g. +254100382352"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Contact Email
            </label>
            <input
              type="email"
              placeholder="e.g. leasing@rentals.ke"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Viewing Instructions & Availability
          </label>
          <input
            type="text"
            placeholder="e.g. On-site caretaker available 9am - 5pm. Please call 2 hours prior to viewing."
            value={formData.viewingInstructions}
            onChange={(e) => setFormData({ ...formData, viewingInstructions: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* SECTION 8: PUBLISHING STATUS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Publishing & Visibility</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Listing Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="AVAILABLE">Published (Live in Houses for Rent section)</option>
              <option value="HIDDEN">Unpublished (Hidden / Draft)</option>
              <option value="RESERVED">Reserved (Pending Tenancy Agreement)</option>
              <option value="SOLD">Leased (Occupied)</option>
            </select>
            <span className="text-[11px] text-slate-500 block mt-1">
              {formData.status === 'AVAILABLE'
                ? '🟢 Visible to all public visitors in the Houses for Rent section.'
                : '🔒 Hidden from the public website.'}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Featured Listing</span>
                <span className="text-[11px] text-slate-500">
                  Highlight this rental at the top of the Houses for Rent section
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/rentals"
          className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isEdit ? 'Save Changes' : 'Publish Rental Listing'}</span>
        </button>
      </div>
    </form>
  );
}
