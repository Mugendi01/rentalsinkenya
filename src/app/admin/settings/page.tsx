'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  CheckCircle,
  Loader2,
  AlertCircle,
  DollarSign,
  Globe,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<Record<string, string>>({
    company_name: '',
    brand_name: '',
    whatsapp_number: '',
    phone_number: '',
    email: '',
    office_address: '',
    business_hours: '',
    instagram_handle: '',
    instagram_url: '',
    default_currency: 'KES',
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update settings');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <Settings className="w-4 h-4" />
            <span>Global Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Platform & Contact Settings
          </h1>
          <p className="text-xs text-slate-500">
            Dynamically update WhatsApp routing, corporate phone numbers, physical address, and branding.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-royal text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4 text-sky-400" />
          )}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Settings updated successfully! Changes are live across the platform.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-bold animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center space-y-3 bg-white rounded-3xl border">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
          <p className="text-xs text-slate-500">Loading settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: WhatsApp & Lead Routing (Critical) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Primary WhatsApp Conversion Routing
                </h3>
                <p className="text-[11px] text-slate-500">
                  Controls all floating WhatsApp buttons, property enquiry links, and header CTAs.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                WhatsApp Phone Number (Digits with Country Code) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="e.g. 254100382352"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Format: <strong>254XXXXXXXXX</strong> (e.g. 254100382352 - digits only with country code).
              </span>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Phone className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Company Contact & Location Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Public Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phone_number || ''}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  placeholder="+254100382352"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Investor Inquiries Email
                </label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="invest@rentals.ke"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Office Physical Address
              </label>
              <input
                type="text"
                value={settings.office_address || ''}
                onChange={(e) => handleChange('office_address', e.target.value)}
                placeholder="The Oval, 4th Floor, Ring Road Parklands, Westlands, Nairobi, Kenya"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Business Operating Hours
              </label>
              <input
                type="text"
                value={settings.business_hours || ''}
                onChange={(e) => handleChange('business_hours', e.target.value)}
                placeholder="Mon - Sat: 8:00 AM - 6:00 PM EAT"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Section 3: Social & Branding */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Instagram className="w-5 h-5 text-pink-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Branding & Instagram Integration
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Company Legal Name
                </label>
                <input
                  type="text"
                  value={settings.company_name || ''}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="Rentals Kenya"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Brand Name / Domain
                </label>
                <input
                  type="text"
                  value={settings.brand_name || ''}
                  onChange={(e) => handleChange('brand_name', e.target.value)}
                  placeholder="Rentals.ke"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={settings.instagram_handle || ''}
                  onChange={(e) => handleChange('instagram_handle', e.target.value)}
                  placeholder="rentals.kenya"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={settings.instagram_url || ''}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/rentals.kenya"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 4: SEO Defaults */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Globe className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Search Engine Optimization (SEO) Defaults
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={settings.meta_title || ''}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={2}
                value={settings.meta_description || ''}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
