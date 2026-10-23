'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Inbox,
  Calendar,
  Bookmark,
  Settings,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageCircle,
  ExternalLink,
  Phone,
  Mail,
  Building2,
  LogOut,
  Loader2,
  Save,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { formatKES, buildWhatsAppUrl, formatDateTime } from '@/lib/formatters';

export default function DashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'enquiries' | 'viewings' | 'saved' | 'profile'>('enquiries');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [savedListings, setSavedListings] = useState<any[]>([]);

  // Selected enquiry for detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    preferredContact: 'WHATSAPP',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch User Profile
      const userRes = await fetch('/api/auth/user');
      if (userRes.status === 401) {
        router.push('/login?redirect=/dashboard');
        return;
      }
      const userData = await userRes.json();
      if (userData.user) {
        setUser(userData.user);
        setProfileForm({
          name: userData.user.name || '',
          email: userData.user.email || '',
          phone: userData.user.phone || '',
          country: userData.user.country || 'Kenya',
          preferredContact: userData.user.preferredContact || 'WHATSAPP',
        });
      }

      // 2. Fetch User Enquiries
      const enquiriesRes = await fetch('/api/enquiries');
      if (enquiriesRes.ok) {
        const enqData = await enquiriesRes.json();
        setEnquiries(enqData.enquiries || []);
      }

      // 3. Fetch Saved Listings
      const savedRes = await fetch('/api/user/saved-listings');
      if (savedRes.ok) {
        const savedData = await savedRes.json();
        setSavedListings(savedData.saved || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update profile');

      setUser(json.user);
      setProfileMessage({
        type: 'success',
        text: json.message || 'Profile updated successfully.',
      });

      if (json.emailRequiresVerification) {
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(profileForm.email)}&redirect=/dashboard`);
        }, 2000);
      }
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Error updating profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        <p className="text-sm font-medium text-slate-600">Loading your account...</p>
      </div>
    );
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Buyer';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">New</span>;
      case 'CONTACTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">Contacted</span>;
      case 'VIEWING_REQUESTED':
      case 'VIEWING_SCHEDULED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">Viewing Scheduled</span>;
      case 'NEGOTIATION':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">Negotiation</span>;
      case 'CONVERTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">Converted</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">Closed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Greeting */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-brand-navy flex items-center justify-center text-white text-2xl font-black shadow-md flex-shrink-0">
              {firstName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Welcome, {firstName}
                </h1>
                {user?.isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Buyer
                  </span>
                ) : (
                  <Link
                    href={`/verify-email?email=${encodeURIComponent(user?.email || '')}`}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Verify Email Now
                  </Link>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {user?.email} &bull; Member since {new Date(user?.createdAt).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/properties"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 transition-all shadow-sm"
            >
              Browse Airbnb Units
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>My Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Listings ({savedListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Details</span>
          </button>
        </div>

        {/* Tab 1: My Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {enquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                  <Inbox className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Enquiries Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse our verified Airbnb setups in Kilimani, Westlands, and across Kenya to enquire directly on takeover opportunities.
                </p>
                <div className="pt-2">
                  <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <span>Browse Properties</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {enquiries.map((enq) => {
                  const propertyTitle = enq.property?.title || 'General Airbnb Investment Enquiry';
                  const propertyLocation = enq.property ? `${enq.property.neighbourhood}, ${enq.property.town}` : 'Kenya';
                  const whatsappMsg = `Hello Rentals Kenya, I am following up on my enquiry #${enq.id.slice(-6)} regarding ${propertyTitle}.`;
                  const whatsappUrl = buildWhatsAppUrl('254100382352', whatsappMsg);

                  return (
                    <div
                      key={enq.id}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:border-sky-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          {getStatusBadge(enq.status)}
                          <span className="text-xs text-slate-400">
                            Submitted: {new Date(enq.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">
                          {propertyTitle}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Location: {propertyLocation} &bull; Purpose: {enq.investmentPurpose}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          &ldquo;{enq.message}&rdquo;
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-shrink-0">
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
                        >
                          View Enquiry
                        </button>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Contact Rentals Kenya</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Listings */}
        {activeTab === 'saved' && (
          <div>
            {savedListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                  <Bookmark className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Saved Listings</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Bookmark ready-to-run Airbnb units while browsing to review and compare setups here.
                </p>
                <div className="pt-2">
                  <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <span>Browse Properties</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedListings.map(({ property }) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="h-44 bg-slate-200 relative">
                      {property.featuredImage && (
                        <img
                          src={property.featuredImage}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-3 left-3 bg-brand-navy/90 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">
                        {property.neighbourhood}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {property.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Asking Price</p>
                          <p className="text-base font-black text-slate-900">{formatKES(property.price)}</p>
                        </div>
                        {property.estRoiPercentage && (
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Projected Net ROI</p>
                            <p className="text-sm font-black text-emerald-600">{property.estRoiPercentage}%</p>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/properties/${property.slug}`}
                        className="block text-center w-full py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-all"
                      >
                        View Full Setup &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Account Details / Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-2xl">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900">Account Details</h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your contact details. Changes to your registered email address will require re-verification.
              </p>
            </div>

            {profileMessage && (
              <div
                className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-3 ${
                  profileMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              {/* Email with Verified Badge */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address
                  </label>
                  {user?.isEmailVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  If you change your email address, a new 6-digit verification code will be sent to confirm ownership.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              {/* Country & Preferred Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Contact Method
                  </label>
                  <select
                    value={profileForm.preferredContact}
                    onChange={(e) => setProfileForm({ ...profileForm, preferredContact: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="PHONE">Phone Call</option>
                    <option value="EMAIL">Email</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-60 cursor-pointer"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Detail Modal for Selected Enquiry */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedEnquiry.status)}
                <span className="text-xs text-slate-400">Ref: #{selectedEnquiry.id.slice(-6)}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 pt-1">
                {selectedEnquiry.property?.title || 'General Enquiry'}
              </h3>
              <p className="text-xs text-slate-500">
                Submitted on {formatDateTime(selectedEnquiry.createdAt)}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Preferred Contact:</span>
                <span className="font-bold text-slate-800">{selectedEnquiry.preferredContact}</span>
              </div>
              {selectedEnquiry.preferredViewingDate && (
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Requested Viewing Date:</span>
                  <span className="font-bold text-slate-800">{selectedEnquiry.preferredViewingDate}</span>
                </div>
              )}
              {selectedEnquiry.budget && (
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Investment Budget:</span>
                  <span className="font-bold text-slate-800">{selectedEnquiry.budget}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500 font-medium block mb-1">Your Message:</span>
                <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 italic">
                  &ldquo;{selectedEnquiry.message}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <a
                href={buildWhatsAppUrl(
                  '254100382352',
                  `Hello Rentals Kenya, following up on enquiry #${selectedEnquiry.id.slice(-6)} regarding ${selectedEnquiry.property?.title || 'an Airbnb setup'}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
