'use client';

import React, { useState, useEffect } from 'react';
import { formatDateTime, cleanPhoneForWhatsApp } from '@/lib/formatters';
import {
  Inbox,
  MessageCircle,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Send,
  Loader2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Note saving state
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      if (data.enquiries) {
        setEnquiries(data.enquiries);
        // If a lead was selected, update it in place
        if (selectedLead) {
          const updated = data.enquiries.find((e: any) => e.id === selectedLead.id);
          if (updated) setSelectedLead(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        await fetchEnquiries();
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNote(true);
    try {
      const existingNotes = selectedLead.internalNotes ? `${selectedLead.internalNotes}\n\n` : '';
      const timestamp = new Date().toLocaleString('en-KE');
      const updatedNotes = `${existingNotes}[${timestamp}] ${newNote.trim()}`;

      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, internalNotes: updatedNotes }),
      });

      if (res.ok) {
        setNewNote('');
        await fetchEnquiries();
      }
    } catch (e) {
      alert('Failed to save notes');
    } finally {
      setSavingNote(false);
    }
  };

  // Filter leads
  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.property && e.property.title.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = [
    { value: 'ALL', label: 'All Leads' },
    { value: 'NEW', label: 'NEW', color: 'bg-rose-100 text-rose-800' },
    { value: 'CONTACTED', label: 'CONTACTED', color: 'bg-sky-100 text-sky-800' },
    { value: 'VIEWING_REQUESTED', label: 'VIEWING REQUESTED', color: 'bg-amber-100 text-amber-800' },
    { value: 'VIEWING_SCHEDULED', label: 'VIEWING SCHEDULED', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'NEGOTIATION', label: 'NEGOTIATION', color: 'bg-purple-100 text-purple-800' },
    { value: 'CONVERTED', label: 'CONVERTED', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'CLOSED', label: 'CLOSED', color: 'bg-slate-100 text-slate-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <Inbox className="w-4 h-4" />
            <span>Lead Management & CRM</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Investor Inquiries & Leads
          </h1>
          <p className="text-xs text-slate-500">
            Track customer communications, pipeline stages, and internal advisory notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
            Total Leads: {enquiries.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, phone, email, property..."
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
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
            <p className="text-xs text-slate-500">Loading inquiries database...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Property of Interest</th>
                  <th className="py-4 px-4">Channel</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((lead) => {
                  const whatsappDigits = cleanPhoneForWhatsApp(lead.phone);
                  const whatsappChatUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                    `Hello ${lead.fullName}, thank you for inquiring with Rentals Kenya regarding ${
                      lead.property ? lead.property.title : 'our investment properties'
                    }. How can we assist you today?`
                  )}`;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Name & Investment Purpose */}
                      <td className="py-4 px-6">
                        <strong className="block text-slate-900 font-bold text-sm">
                          {lead.fullName}
                        </strong>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">
                          {lead.investmentPurpose?.replace(/_/g, ' ') || 'AIRBNB'}
                        </span>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-semibold text-slate-800">
                          {lead.phone}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {lead.email}
                        </div>
                      </td>

                      {/* Property */}
                      <td className="py-4 px-4 max-w-xs">
                        {lead.property ? (
                          <div>
                            <span className="font-semibold text-slate-900 line-clamp-1">
                              {lead.property.title}
                            </span>
                            <span className="text-[11px] text-sky-600">
                              {lead.property.neighbourhood}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">General Inquiry</span>
                        )}
                      </td>

                      {/* Preferred Contact Channel */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {lead.preferredContact === 'WHATSAPP' && <MessageCircle className="w-3 h-3 text-emerald-600" />}
                          {lead.preferredContact === 'PHONE' && <Phone className="w-3 h-3 text-sky-600" />}
                          {lead.preferredContact === 'EMAIL' && <Mail className="w-3 h-3 text-indigo-600" />}
                          <span>{lead.preferredContact}</span>
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border-0 cursor-pointer ${
                            lead.status === 'NEW'
                              ? 'bg-rose-100 text-rose-800'
                              : lead.status === 'CONTACTED'
                              ? 'bg-sky-100 text-sky-800'
                              : lead.status === 'VIEWING_REQUESTED'
                              ? 'bg-amber-100 text-amber-800'
                              : lead.status === 'VIEWING_SCHEDULED'
                              ? 'bg-indigo-100 text-indigo-800'
                              : lead.status === 'NEGOTIATION'
                              ? 'bg-purple-100 text-purple-800'
                              : lead.status === 'CONVERTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="VIEWING_REQUESTED">VIEWING REQUESTED</option>
                          <option value="VIEWING_SCHEDULED">VIEWING SCHEDULED</option>
                          <option value="NEGOTIATION">NEGOTIATION</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {formatDateTime(lead.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Direct WhatsApp Chat */}
                          <a
                            href={whatsappChatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors"
                            title="Chat with Customer on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Open Details Modal */}
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-colors"
                            title="View Message & Internal Notes"
                          >
                            <FileText className="w-4 h-4" />
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
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No leads match filter</h4>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* LEAD DETAILS & NOTES MODAL / DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Lead Details & Inquiry History
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {selectedLead.fullName}
                </h3>
                <span className="text-xs text-slate-500">
                  Received on {formatDateTime(selectedLead.createdAt)}
                </span>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact & Property Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Phone</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedLead.phone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Email</span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{selectedLead.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Budget</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedLead.budget || 'Not specified'}</p>
              </div>
            </div>

            {/* Customer Message */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Customer Message
              </span>
              <div className="p-4 rounded-2xl bg-slate-100 text-slate-800 text-sm whitespace-pre-line leading-relaxed border border-slate-200">
                "{selectedLead.message}"
              </div>
            </div>

            {/* Internal Notes History */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Advisor Internal Notes & Follow-Up Log
              </span>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 whitespace-pre-line max-h-48 overflow-y-auto leading-relaxed">
                {selectedLead.internalNotes || 'No internal notes recorded yet.'}
              </div>

              {/* Add New Note Input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add internal note (e.g. Spoke on phone, sent contract)..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  disabled={savingNote || !newNote.trim()}
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-brand-navy hover:bg-brand-royal text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50"
                >
                  {savingNote ? 'Saving...' : 'Add Note'}
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Change Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                  className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="VIEWING_SCHEDULED">Viewing Scheduled</option>
                  <option value="NEGOTIATING">Negotiating</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <a
                href={`https://wa.me/${cleanPhoneForWhatsApp(selectedLead.phone)}?text=${encodeURIComponent(
                  `Hello ${selectedLead.fullName}, reaching out from Rentals Kenya regarding your property inquiry.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
