'use client';

import React, { useState, useEffect } from 'react';
import { formatDateTime, cleanPhoneForWhatsApp } from '@/lib/formatters';
import {
  Calendar,
  Clock,
  Search,
  MessageCircle,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  MapPin,
} from 'lucide-react';

export default function AdminViewingsPage() {
  const [viewings, setViewings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchViewings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/viewings');
      const data = await res.json();
      if (data.viewings) {
        setViewings(data.viewings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViewings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/viewings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        await fetchViewings();
      }
    } catch (e) {
      alert('Failed to update viewing status');
    }
  };

  const filtered = viewings.filter((v) => {
    const matchesSearch =
      v.fullName.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search) ||
      (v.property && v.property.title.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Inspection Scheduler</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Property Viewing Appointments
          </h1>
          <p className="text-xs text-slate-500">
            Confirm on-site dates, assign caretakers, and follow up with prospective investors.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 self-start sm:self-auto">
          Total Bookings: {viewings.length}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, phone, property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500"
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
            <option value="PENDING">Pending Confirmation</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="RESCHEDULED">Rescheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Viewings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
            <p className="text-xs text-slate-500">Loading viewing calendar...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-4">Property</th>
                  <th className="py-4 px-4">Scheduled Date & Time</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Notes</th>
                  <th className="py-4 px-6 text-right">Confirm / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((viewing) => {
                  const whatsappDigits = cleanPhoneForWhatsApp(viewing.phone);
                  const confirmWhatsAppUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                    `Hello ${viewing.fullName}, this is Rentals Kenya. We would like to confirm your viewing appointment for "${viewing.property.title}" on ${viewing.preferredDate} (${viewing.preferredTime}). Will this schedule work well for you?`
                  )}`;

                  return (
                    <tr
                      key={viewing.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Customer */}
                      <td className="py-4 px-6">
                        <strong className="block text-slate-900 font-bold text-sm">
                          {viewing.fullName}
                        </strong>
                        <div className="text-[11px] text-slate-500">
                          {viewing.phone} • {viewing.email}
                        </div>
                      </td>

                      {/* Property */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {viewing.property.title}
                        </div>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-500" />
                          {viewing.property.neighbourhood}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>{viewing.preferredDate}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{viewing.preferredTime}</span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={viewing.status}
                          onChange={(e) => handleUpdateStatus(viewing.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border-0 cursor-pointer ${
                            viewing.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : viewing.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : viewing.status === 'COMPLETED'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="RESCHEDULED">Rescheduled</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>

                      {/* Notes / Message */}
                      <td className="py-4 px-4 max-w-xs text-slate-600 line-clamp-2">
                        {viewing.message || 'No special notes'}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={confirmWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors text-[11px]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Confirm WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${viewing.phone}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
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
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No viewings found</h4>
            <p className="text-xs text-slate-500">
              New viewing requests submitted from property pages will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
