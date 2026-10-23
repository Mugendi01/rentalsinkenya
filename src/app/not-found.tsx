import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';
import { Home, Building2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <BrandLogo variant="dark" size="lg" className="justify-center" />

        <div className="space-y-2">
          <span className="text-6xl font-black text-brand-navy">404</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Property or Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The property listing you are looking for may have been sold, unpublished, or the URL might be mistyped.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-royal text-white text-xs font-bold transition-all shadow"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Browse Available Properties</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
