import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatKES, formatDateTime } from '@/lib/formatters';
import {
  Building2,
  Home,
  CheckCircle,
  Clock,
  Sparkles,
  Inbox,
  Calendar,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Aggregate Metrics
  const [
    totalProperties,
    availableProperties,
    soldProperties,
    featuredProperties,
    airbnbReadyProperties,
    totalRentals,
    totalEnquiries,
    newEnquiries,
    pendingViewings,
    recentEnquiries,
    recentViewings,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: 'AVAILABLE' } }),
    prisma.property.count({ where: { status: 'SOLD' } }),
    prisma.property.count({ where: { isFeatured: true } }),
    prisma.property.count({ where: { isAirbnbReady: true } }),
    prisma.property.count({
      where: {
        OR: [{ operationalAssets: 'RENTAL' }, { isAirbnbReady: false }],
      },
    }),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: 'NEW' } }),
    prisma.viewingRequest.count({ where: { status: 'PENDING' } }),
    prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { title: true, neighbourhood: true } } },
    }),
    prisma.viewingRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { title: true } } },
    }),
  ]);

  const kpis = [
    {
      title: 'Rental Listings',
      value: totalRentals,
      sub: 'Primary: Houses & apartments for rent',
      icon: Home,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Airbnb Takeovers',
      value: airbnbReadyProperties,
      sub: `${availableProperties} Available • ${soldProperties} Sold`,
      icon: Building2,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      title: 'Customer Leads',
      value: totalEnquiries,
      sub: `${newEnquiries} New uncontacted leads`,
      icon: Inbox,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Viewing Appointments',
      value: pendingViewings,
      sub: 'Action required to confirm slots',
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Rentals Kenya Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real estate inventory, Airbnb performance tracking, and lead CRM management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/rentals/new"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Rental</span>
          </Link>

          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-royal text-white text-xs font-bold shadow transition-all"
          >
            <PlusCircle className="w-4 h-4 text-sky-400" />
            <span>Add Takeover</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {kpi.value}
                </div>
                <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Bottom Tables: Recent Enquiries & Viewing Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Enquiries CRM */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900">
                Recent Leads & Inquiries
              </h2>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold text-sm">
                        {lead.fullName}
                      </strong>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          lead.status === 'NEW'
                            ? 'bg-rose-100 text-rose-800'
                            : lead.status === 'CONTACTED'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    <p className="text-slate-500 line-clamp-1">
                      {lead.property ? (
                        <span>
                          Property: <strong className="text-slate-700">{lead.property.title}</strong> ({lead.property.neighbourhood})
                        </span>
                      ) : (
                        <span>General Investment Consultation</span>
                      )}
                    </p>

                    <div className="text-slate-400 text-[10px]">
                      {lead.phone} • {formatDateTime(lead.createdAt)}
                    </div>
                  </div>

                  <Link
                    href={`/admin/enquiries`}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-600 font-semibold border border-slate-200 transition-colors"
                  >
                    Open Lead
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No recent leads recorded yet.
              </p>
            )}
          </div>
        </div>

        {/* Pending Viewing Requests */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Viewing Appointments
              </h2>
            </div>
            <Link
              href="/admin/viewings"
              className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentViewings.length > 0 ? (
              recentViewings.map((viewing) => (
                <div
                  key={viewing.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">
                      {viewing.fullName}
                    </strong>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        viewing.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {viewing.status}
                    </span>
                  </div>

                  <p className="text-slate-600 line-clamp-1 font-medium">
                    {viewing.property.title}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>
                      📅 {viewing.preferredDate} ({viewing.preferredTime})
                    </span>
                    <a
                      href={`tel:${viewing.phone}`}
                      className="text-sky-600 hover:underline font-semibold"
                    >
                      {viewing.phone}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No viewing appointments booked yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
