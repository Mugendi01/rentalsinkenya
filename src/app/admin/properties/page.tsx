'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatKES } from '@/lib/formatters';
import {
  Building2,
  Home,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Copy,
  Edit,
  Trash2,
  CheckCircle,
  Sparkles,
  ExternalLink,
  Loader2,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/properties');
      const data = await res.json();
      if (data.properties) {
        setProperties(data.properties);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';
    try {
      setActionLoadingId(id);
      await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      await fetchProperties();
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      setActionLoadingId(id);
      await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });
      await fetchProperties();
    } catch (e) {
      alert('Failed to update featured flag');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!confirm('Duplicate this property listing?')) return;
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/properties/${id}/duplicate`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchProperties();
        alert('Property duplicated successfully as a draft copy!');
      }
    } catch (e) {
      alert('Failed to duplicate property');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchProperties();
      }
    } catch (e) {
      alert('Failed to delete property');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter properties locally (Airbnb Takeovers only)
  const filtered = properties.filter((p) => {
    // Keep residential rentals separate
    if (p.operationalAssets === 'RENTAL') return false;

    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.neighbourhood.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Quick Switch Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Looking to manage residential rentals (monthly tenancy apartments and houses)?
          </span>
        </div>
        <Link
          href="/admin/rentals"
          className="font-bold text-emerald-700 hover:text-emerald-900 underline whitespace-nowrap"
        >
          Open Rental Listings &rarr;
        </Link>
      </div>

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Airbnb Takeover Catalog</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Airbnb Business Takeovers
          </h1>
          <p className="text-xs text-slate-500">
            Publish, edit, duplicate, and configure turnkey Airbnb setup listings.
          </p>
        </div>

        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-navy hover:bg-brand-royal text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-sky-400" />
          <span>Add New Airbnb Setup</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, suburb (e.g. Kilimani)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="SOLD">Sold</option>
            <option value="RESERVED">Reserved</option>
            <option value="COMING_SOON">Coming Soon</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
            <p className="text-xs text-slate-500">Loading properties inventory...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-4 px-6">Property</th>
                  <th className="py-4 px-4">Type & Beds</th>
                  <th className="py-4 px-4">Price (KES)</th>
                  <th className="py-4 px-4">Airbnb Ready</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((prop) => {
                  const img =
                    prop.featuredImage ||
                    (prop.images && prop.images[0]?.imageUrl) ||
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80';

                  const isBusy = actionLoadingId === prop.id;

                  return (
                    <tr
                      key={prop.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Property Title & Image */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                            <Image
                              src={img}
                              alt={prop.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="max-w-xs">
                            <Link
                              href={`/properties/${prop.slug}`}
                              target="_blank"
                              className="font-bold text-slate-900 hover:text-sky-600 line-clamp-1 transition-colors flex items-center gap-1"
                            >
                              <span>{prop.title}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </Link>
                            <span className="text-[11px] text-slate-500">
                              {prop.neighbourhood}, {prop.county}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type & Beds */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">
                          {prop.bedrooms} Bed{prop.bedrooms === 1 ? '' : 's'} • {prop.bathrooms} Bath
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {prop.propertyType}
                        </span>
                      </td>

                      {/* Price in KES */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {formatKES(prop.price)}
                        {prop.estMonthlyIncome && (
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            ~{formatKES(prop.estMonthlyIncome)}/mo
                          </div>
                        )}
                      </td>

                      {/* Airbnb Ready */}
                      <td className="py-4 px-4">
                        {prop.isAirbnbReady ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                            <Sparkles className="w-3 h-3 text-sky-600" />
                            Ready
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Standard</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(prop.id, prop.status)}
                          disabled={isBusy}
                          title="Click to toggle Available / Sold"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                            prop.status === 'AVAILABLE'
                              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                              : prop.status === 'SOLD'
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                          }`}
                        >
                          {prop.status}
                        </button>
                      </td>

                      {/* Featured */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(prop.id, prop.isFeatured)}
                          disabled={isBusy}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            prop.isFeatured
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'text-slate-400 hover:text-slate-600 border border-slate-200'
                          }`}
                        >
                          {prop.isFeatured ? '★ Featured' : '☆ Standard'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit */}
                          <Link
                            href={`/admin/properties/${prop.id}/edit`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-colors"
                            title="Edit Property"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(prop.id)}
                            disabled={isBusy}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
                            title="Duplicate Property"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(prop.id, prop.title)}
                            disabled={isBusy}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No properties found</h4>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or add a new property listing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
