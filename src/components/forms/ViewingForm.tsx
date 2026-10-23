'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { viewingRequestSchema } from '@/lib/validations';
import { z } from 'zod';
import { Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type ViewingFormData = z.infer<typeof viewingRequestSchema>;

interface ViewingFormProps {
  propertyId: string;
  propertyTitle: string;
  propertyLocation?: string;
  onSuccess?: () => void;
}

export default function ViewingForm({
  propertyId,
  propertyTitle,
  propertyLocation,
  onSuccess,
}: ViewingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Today + 1 day formatted as YYYY-MM-DD for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ViewingFormData>({
    resolver: zodResolver(viewingRequestSchema),
    defaultValues: {
      propertyId,
      preferredDate: minDateStr,
      preferredTime: 'Morning (10:00 AM)',
      message: `I would like to schedule a private on-site inspection for ${propertyTitle}.`,
    },
  });

  const onSubmit = async (data: ViewingFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch('/api/viewings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit viewing request');
      }

      setIsSuccess(true);
      reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-slate-900">Viewing Request Booked!</h4>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          Our property coordinator has received your viewing request for <strong>{propertyTitle}</strong>. We will confirm your calendar slot via WhatsApp/Phone shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      {serverError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <input type="hidden" {...register('propertyId')} value={propertyId} />

      {/* Full Name */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Grace Wanjiku"
          {...register('fullName')}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900"
        />
        {errors.fullName && (
          <p className="text-[11px] text-rose-600 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="+254 100 382 352"
            {...register('phone')}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900"
          />
          {errors.phone && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            placeholder="grace@example.com"
            {...register('email')}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900"
          />
          {errors.email && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Preferred Date</span>
          </label>
          <input
            type="date"
            min={minDateStr}
            {...register('preferredDate')}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
          />
          {errors.preferredDate && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.preferredDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Preferred Time</span>
          </label>
          <select
            {...register('preferredTime')}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
          >
            <option value="Morning (09:00 AM - 11:30 AM)">Morning (9am - 11:30am)</option>
            <option value="Midday (12:00 PM - 02:00 PM)">Midday (12pm - 2pm)</option>
            <option value="Afternoon (02:30 PM - 05:00 PM)">Afternoon (2:30pm - 5pm)</option>
            <option value="Weekend (Saturday)">Weekend (Saturday Morning)</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          Special Notes / Transportation requirements
        </label>
        <textarea
          rows={2}
          {...register('message')}
          placeholder="Any specific questions or parking requirements..."
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-900"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Confirming Schedule...</span>
          </>
        ) : (
          <span>Book Property Inspection</span>
        )}
      </button>
    </form>
  );
}
