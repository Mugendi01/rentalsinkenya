'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquirySchema } from '@/lib/validations';
import { z } from 'zod';
import {
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  MailCheck,
  UserPlus,
  LogIn,
  Send,
  Calendar,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/formatters';

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface EnquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  whatsappNumber?: string;
  onSuccess?: () => void;
}

export default function EnquiryForm({
  propertyId,
  propertyTitle,
  propertyLocation,
  whatsappNumber = '254100382352',
  onSuccess,
}: EnquiryFormProps) {
  const pathname = usePathname();

  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'unverified' | 'verified'>('loading');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultMessage = propertyTitle
    ? `Hello Rentals Kenya, I am interested in this ${propertyTitle}${propertyLocation ? ` in ${propertyLocation}` : ''}. I would like more information on availability and viewing schedule.`
    : 'Hello Rentals Kenya, I would like to consult on available rental apartments, houses, and Airbnb setups in Kenya.';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      propertyId: propertyId || null,
      preferredContact: 'WHATSAPP',
      investmentPurpose: 'AIRBNB',
      message: defaultMessage,
    },
  });

  // Check auth state
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/user');
        if (res.status === 401) {
          setAuthStatus('unauthenticated');
          return;
        }

        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          setValue('fullName', data.user.name || '');
          setValue('email', data.user.email || '');
          setValue('phone', data.user.phone || '');
          if (data.user.preferredContact) {
            setValue('preferredContact', data.user.preferredContact);
          }

          if (!data.user.isEmailVerified || data.user.status === 'UNVERIFIED') {
            setAuthStatus('unverified');
          } else {
            setAuthStatus('verified');
          }
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch (e) {
        setAuthStatus('unauthenticated');
      }
    }
    checkAuth();
  }, [setValue]);

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.code === 'EMAIL_VERIFICATION_REQUIRED') {
          setAuthStatus('unverified');
          throw new Error(json.error);
        }
        throw new Error(json.error || 'Failed to submit enquiry');
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

  const returnUrl = encodeURIComponent(pathname || '/properties');

  // 1. Loading State
  if (authStatus === 'loading') {
    return (
      <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-slate-200/60">
        <Loader2 className="w-6 h-6 animate-spin text-sky-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Checking enquiry authorization...</p>
      </div>
    );
  }

  // 2. Unauthenticated State (Prompt to Register / Login without preventing public browsing)
  if (authStatus === 'unauthenticated') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-brand-navy rounded-2xl p-6 text-white text-center space-y-4 shadow-lg border border-brand-royal/40">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white">Create an Account to Enquire</h4>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            Property browsing is completely public. To enquire on this Airbnb setup or request a viewing, please create a verified buyer account.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Link
            href={`/register?redirect=${returnUrl}`}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Buyer Account</span>
          </Link>
          <Link
            href={`/login?redirect=${returnUrl}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-600 hover:border-slate-400 hover:bg-white/5 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-sky-400" />
            <span>Already have an account? Sign In</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Unverified State (Prompt to Verify Email)
  if (authStatus === 'unverified') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <MailCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-amber-900">Email Verification Required</h4>
          <p className="text-xs text-amber-800 max-w-sm mx-auto leading-relaxed">
            Please verify your email address before submitting an enquiry. We sent a 6-digit code to <strong>{currentUser?.email}</strong>.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href={`/verify-email?email=${encodeURIComponent(currentUser?.email || '')}&redirect=${returnUrl}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <span>Verify Email</span>
          </Link>
        </div>
      </div>
    );
  }

  // 4. Success State
  if (isSuccess) {
    const whatsappContinueUrl = buildWhatsAppUrl(
      whatsappNumber,
      `Hello Rentals Kenya, I just submitted an enquiry for ${propertyTitle || 'an Airbnb setup'}.`
    );

    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-slate-900">Enquiry Received!</h4>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Thank you, {currentUser?.name}. Your enquiry has been saved to your account. A confirmation email has been dispatched.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
          >
            View in Dashboard
          </Link>
          <a
            href={whatsappContinueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  // 5. Authenticated & Verified: Render Full Form with pre-populated fields
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Auto-populated Identity Notification */}
      <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800 flex items-center justify-between">
        <span>Submitting as: <strong>{currentUser?.name}</strong> ({currentUser?.email})</span>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-200/80 px-2 py-0.5 rounded text-sky-900">Verified</span>
      </div>

      {/* Hidden inputs */}
      <input type="hidden" {...register('fullName')} />
      <input type="hidden" {...register('email')} />
      <input type="hidden" {...register('phone')} />
      <input type="hidden" {...register('propertyId')} />

      {/* Message */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Your Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          {...register('message')}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
        />
        {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message.message}</p>}
      </div>

      {/* Preferred Contact & Viewing Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Preferred Contact
          </label>
          <select
            {...register('preferredContact')}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          >
            <option value="WHATSAPP">WhatsApp</option>
            <option value="PHONE">Phone Call</option>
            <option value="EMAIL">Email</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Preferred Viewing Date
          </label>
          <input
            type="date"
            {...register('preferredViewingDate')}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          />
        </div>
      </div>

      {/* Budget & Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Budget (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. KES 300K - 500K"
            {...register('budget')}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Questions
          </label>
          <input
            type="text"
            placeholder="e.g. Inventory checklist, lease terms"
            {...register('additionalQuestions')}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-sky-600 hover:bg-sky-500 font-bold text-xs shadow-md shadow-sky-600/20 active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Property Enquiry</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
