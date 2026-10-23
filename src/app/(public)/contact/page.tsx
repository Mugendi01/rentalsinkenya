import React from 'react';
import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';
import { buildWhatsAppUrl } from '@/lib/formatters';
import EnquiryForm from '@/components/forms/EnquiryForm';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Instagram,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Rentals Kenya (+254100382352)',
  description:
    'Get in touch with Rentals Kenya for rental apartments and houses, or Airbnb business takeovers. Call or WhatsApp +254100382352, office at The Oval Westlands Nairobi.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const directWhatsAppUrl = buildWhatsAppUrl(
    settings.whatsapp_number,
    'Hello Rentals Kenya, I am inquiring about rental apartments and properties on Rentals.ke.'
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <Phone className="w-3.5 h-3.5 text-sky-600" />
            <span>We’re Here to Assist</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Talk to Rentals Kenya
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Have questions about an available rental apartment or house, tenancy viewing, or Airbnb takeover setup? Reach out directly to our Nairobi team.
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick WhatsApp Action Card */}
            <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Fastest Response</h3>
                  <p className="text-xs text-emerald-100">WhatsApp +254100382352 is our primary channel</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
                Connect instantly with our leasing and property team for immediate photos, tenancy requirements, and viewing schedules.
              </p>
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow hover:bg-emerald-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat on WhatsApp (+254100382352)</span>
              </a>
            </div>

            {/* Office Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Office Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">
                      Physical Location
                    </strong>
                    <span>{settings.office_address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">
                      Telephone
                    </strong>
                    <a href={`tel:${settings.phone_number}`} className="hover:underline">
                      {settings.phone_number}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">
                      Email Address
                    </strong>
                    <a href={`mailto:${settings.email}`} className="hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">
                      Operating Hours
                    </strong>
                    <span>{settings.business_hours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Instagram className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">
                      Instagram
                    </strong>
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:underline"
                    >
                      @{settings.instagram_handle}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Placeholder */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900">
                Office Location Map (Westlands, Nairobi)
              </h4>
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-4 text-center">
                <MapPin className="w-8 h-8 text-sky-600 mb-2 animate-bounce" />
                <span className="font-bold text-xs text-slate-800">
                  The Oval, Ring Road Parklands
                </span>
                <span className="text-[11px] text-slate-500">
                  Westlands, Nairobi, Kenya
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Online Consultation Request
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Fill in your details below and our property investment desk will reach out within business hours.
              </p>
            </div>

            <EnquiryForm whatsappNumber={settings.whatsapp_number} />
          </div>
        </div>
      </div>
    </div>
  );
}
