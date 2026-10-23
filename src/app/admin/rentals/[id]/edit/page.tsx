'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RentalForm from '@/components/admin/RentalForm';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditRentalListingPage() {
  const params = useParams();
  const id = params?.id as string;
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/rentals/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to load rental listing');
        }
        return res.json();
      })
      .then((data) => {
        if (data.rental) {
          setRental(data.rental);
        } else {
          setError('Rental listing not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Error fetching rental details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="text-xs font-semibold">Loading rental listing details...</span>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Rental Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'The requested rental listing does not exist.'}</p>
        <Link
          href="/admin/rentals"
          className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          Return to Rental Listings
        </Link>
      </div>
    );
  }

  return <RentalForm initialData={rental} isEdit={true} />;
}
