import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PropertyForm from '@/components/admin/PropertyForm';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';

interface EditPropertyPageProps {
  params: { id: string };
}

export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      amenities: true,
    },
  });

  if (!property) {
    notFound();
  }

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
            <Edit className="w-5 h-5 text-sky-600" />
            <span>Edit Property: {property.title}</span>
          </h1>
          <p className="text-xs text-slate-500">
            Update pricing, Airbnb forecasts, photo gallery, and amenities.
          </p>
        </div>
      </div>

      <PropertyForm initialData={property} isEdit={true} />
    </div>
  );
}
