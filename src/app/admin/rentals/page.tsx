'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatKES } from '@/lib/formatters';
import {
  Home,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Sparkles,
  ExternalLink,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  MapPin,
  Bed,
  Bath,
  RotateCcw,
} from 'lucide-react';

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/rentals');
      const data = await res.json();
      if (data.rentals) {
        setRentals(data.rentals);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  // Quick toggle Publish / Unpublish
  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'HIDDEN' : 'AVAILABLE';
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/rentals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await fetchRentals();
      } else {
        alert('Failed to update status');
      }
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Quick toggle Featured
  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/rentals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });
      if (res.ok) {
        await fetchRentals();
      }
    } catch (e) {
      alert('Failed to update featured flag');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete rental
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete rental listing "${title}"? This cannot be undone.`)) return;
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/rentals/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchRentals();
      } else {
        alert('Failed to delete rental listing');
      }
    } catch (e) {
      alert('Failed to delete rental listing');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Computed stats
  const totalCount = rentals.length;
  const publishedCount = rentals.filter((r) => r.status === 'AVAILABLE').length;
  const unpublishedCount = rentals.filter((r) => r.status === 'HIDDEN').length;
  const avgRent =
    totalCount > 0
      ? Math.round(
          rentals.reduce((acc, curr) => acc + (curr.monthlyRent || curr.price || 0), 0) / totalCount
        )
      : 0;

  // Filter rentals
  const filteredRentals = rentals.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.neighbourhood.toLowerCase().includes(search.toLowerCase()) ||
      r.town.toLowerCase().includes(search.toLowerCase()) ||
      (r.address && r.address.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && r.status === 'AVAILABLE') ||
      (statusFilter === 'UNPUBLISHED' && r.status === 'HIDDEN') ||
      r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TOP HEADER & PRIMARY ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Tenancy Management
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Houses & Apartments for Rent</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Rental Property Listings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage residential houses and apartments available for rent. Published listings appear automatically in the public Houses for Rent section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#houses-for-rent"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <span>View Public Section</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Link
            href="/admin/rentals/new"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Rental Listing</span>
          </Link>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Rentals
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-400">All managed rental units</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Published (Live)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {publishedCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Active in Houses for Rent</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Unpublished / Drafts
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-700 mt-1">
            {unpublishedCount}
          </div>
          <span className="text-[11px] text-slate-400">Hidden from public view</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
            Avg Monthly Rent
          </span>
          <div className="text-2xl sm:text-3xl font-black text-sky-600 mt-1">
            {formatKES(avgRent)}
          </div>
          <span className="text-[11px] text-slate-400">Per month across listings</span>
        </div>
      </div>

      {/* 3. SEARCH & STATUS FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, neighbourhood, or town..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('PUBLISHED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === 'PUBLISHED'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Published ({publishedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('UNPUBLISHED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === 'UNPUBLISHED'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unpublished ({unpublishedCount})
          </button>
        </div>
      </div>

      {/* 4. RENTALS TABLE / CARD LIST */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-xs font-semibold">Loading rental property listings...</span>
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Home className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No rental listings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || statusFilter !== 'ALL'
                ? 'Try clearing your search or status filters to view listings.'
                : 'Get started by creating your first residential rental apartment or house listing.'}
            </p>
            <Link
              href="/admin/rentals/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add First Rental Listing</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Monthly Rent</th>
                  <th className="py-3.5 px-4">Specs</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRentals.map((rental) => {
                  const isActionLoading = actionLoadingId === rental.id;
                  const isPublished = rental.status === 'AVAILABLE';
                  const monthlyRent = rental.monthlyRent || rental.price || 0;
                  const coverImage =
                    rental.featuredImage ||
                    (rental.images && rental.images.length > 0 ? rental.images[0].imageUrl : null) ||
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80';

                  return (
                    <tr key={rental.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Property Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-11 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                            <Image
                              src={coverImage}
                              alt={rental.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="max-w-xs">
                            <Link
                              href={`/admin/rentals/${rental.id}/edit`}
                              className="font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1 text-xs sm:text-sm"
                            >
                              {rental.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">
                                {rental.propertyType}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-[10px] text-slate-500">
                                {rental.furnishing || 'Furnished'}
                              </span>
                              {rental.isFeatured && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                    Featured
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-slate-700">
                        <div className="flex items-center gap-1 font-semibold text-xs">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{rental.neighbourhood}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block pl-4.5">
                          {rental.town}, {rental.county}
                        </span>
                      </td>

                      {/* Monthly Rent */}
                      <td className="py-3 px-4">
                        <div className="font-black text-slate-900 text-sm">
                          {formatKES(monthlyRent)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          / month
                        </span>
                      </td>

                      {/* Specs */}
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{rental.bedrooms} Bed</span>
                          <span>•</span>
                          <span className="font-semibold">{rental.bathrooms} Bath</span>
                        </div>
                        {rental.sizeSqft && (
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {rental.sizeSqft} sqft
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPublished
                              ? 'bg-emerald-100 text-emerald-800'
                              : rental.status === 'RESERVED'
                              ? 'bg-amber-100 text-amber-800'
                              : rental.status === 'SOLD'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          <span>{isPublished ? 'Published' : 'Unpublished'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Publish / Unpublish Toggle */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleTogglePublish(rental.id, rental.status)}
                            title={isPublished ? 'Unpublish (Hide from public)' : 'Publish (Make live in Houses for Rent)'}
                            className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                              isPublished
                                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                            }`}
                          >
                            {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Edit */}
                          <Link
                            href={`/admin/rentals/${rental.id}/edit`}
                            title="Edit Rental Listing"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          {/* View Live */}
                          <Link
                            href={`/properties/${rental.slug}`}
                            target="_blank"
                            title="View Public Page"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => handleDelete(rental.id, rental.title)}
                            title="Delete Rental Listing"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
