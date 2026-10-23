'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Compass,
  Plus,
  Trash2,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New location form state
  const [name, setName] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/locations');
      const data = await res.json();
      if (data.locations) setLocations(data.locations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          county,
          description,
          imageUrl: imageUrl || undefined,
          isFeatured,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add location');

      // Reset and refresh
      setName('');
      setDescription('');
      setImageUrl('');
      setIsFeatured(false);
      setShowAddModal(false);
      await fetchLocations();
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLocation = async (id: string, locName: string) => {
    if (!confirm(`Delete location "${locName}"?`)) return;
    try {
      await fetch(`/api/locations?id=${id}`, { method: 'DELETE' });
      await fetchLocations();
    } catch (e) {
      alert('Failed to delete location');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <Compass className="w-4 h-4" />
            <span>Regional Hubs</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Strategic Investment Locations
          </h1>
          <p className="text-xs text-slate-500">
            Organize Kenyan property corridors, tourism hubs, and suburb showcases.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-navy hover:bg-brand-royal text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-sky-400" />
          <span>Add New Location</span>
        </button>
      </div>

      {/* Locations Grid */}
      {loading ? (
        <div className="p-16 text-center space-y-3 bg-white rounded-3xl border">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
          <p className="text-xs text-slate-500">Loading locations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <Image
                    src={loc.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                    alt={loc.name}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {loc.isFeatured && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow">
                      Featured
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] text-sky-300 font-semibold block">
                      {loc.county} County
                    </span>
                    <h3 className="text-lg font-bold">{loc.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {loc.description || 'No detailed description added.'}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDeleteLocation(loc.id, loc.name)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Location"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD LOCATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900">
              Add New Strategic Location
            </h3>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleAddLocation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Location Name (e.g. Nyali, Naivasha, Runda) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Nyali"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  County <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  placeholder="e.g. Mombasa"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Cover Photo URL (High-res Unsplash or direct image)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Short Market Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this area strategic for Airbnb or rental investment?..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600"
                />
                <span className="font-bold text-slate-800">
                  Feature on homepage Top Locations showcase
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-brand-royal text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Location</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
