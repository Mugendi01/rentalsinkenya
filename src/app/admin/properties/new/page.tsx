import React from 'react';
import PropertyForm from '@/components/admin/PropertyForm';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export const metadata = {
  title: 'Add New Property | Rentals Kenya Admin',
};

export default function NewPropertyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/properties"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-sky-600" />
            <span>Create New Property Listing</span>
          </h1>
          <p className="text-xs text-slate-500">
            Quick 5-step wizard to add an Airbnb-ready or rental investment asset in 3–5 minutes.
          </p>
        </div>
      </div>

      <PropertyForm isEdit={false} />
    </div>
  );
}
