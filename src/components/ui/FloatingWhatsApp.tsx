'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/formatters';

interface FloatingWhatsAppProps {
  phone?: string;
  defaultMessage?: string;
}

export default function FloatingWhatsApp({
  phone = '254100382352',
  defaultMessage = 'Hello Rentals Kenya, I am browsing rental houses and apartments on Rentals.ke and would like to speak with an advisor.',
}: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(phone, defaultMessage);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end print:hidden">
      {/* Tooltip Popup */}
      {showTooltip && (
        <div className="mb-2 max-w-xs bg-slate-900 text-white text-xs p-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between font-bold text-sky-400 mb-1">
            <span>Rentals Kenya (+254100382352)</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-300">
            Have questions about renting an apartment, scheduling a viewing, or Airbnb setups? Chat directly with us on WhatsApp!
          </p>
        </div>
      )}

      {/* Floating CTA Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp with Rentals Kenya"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 text-white fill-white" />
        <span className="hidden sm:inline font-semibold text-sm pr-1">
          WhatsApp Us
        </span>
      </a>
    </div>
  );
}
