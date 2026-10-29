'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  readConsent,
  writeConsent,
} from '@/lib/cookie-consent';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setVisible(true);

    const open = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
  }, []);

  if (!visible) return null;

  const save = (choice: { analytics: boolean; marketing: boolean }) => {
    writeConsent(choice);
    setVisible(false);
    setCustomizing(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
    >
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-2xl p-5 text-sm text-slate-700 space-y-4">
        <div className="space-y-1">
          <p className="font-bold text-slate-900">We use cookies</p>
          <p className="text-xs sm:text-sm leading-relaxed">
            We use strictly necessary cookies to keep you signed in and remember your cookie choices. Optional
            analytics or marketing cookies are only used if you allow them. Read our{' '}
            <Link href="/cookies" className="text-sky-600 underline">Cookie Policy</Link> and{' '}
            <Link href="/privacy" className="text-sky-600 underline">Privacy Policy</Link>.
          </p>
        </div>

        {customizing && (
          <div className="space-y-3 border-t border-slate-100 pt-3 text-xs sm:text-sm">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <span className="font-semibold text-slate-900">Strictly necessary</span> — sign-in sessions and your
                cookie choice. Always on.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
              <span>
                <span className="font-semibold text-slate-900">Analytics</span> — helps us understand how the site is
                used. We do not currently use any analytics cookies.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>
                <span className="font-semibold text-slate-900">Marketing</span> — used to measure adverts. We do not
                currently use any marketing cookies.
              </span>
            </label>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          {customizing ? (
            <button
              type="button"
              onClick={() => save({ analytics, marketing })}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold"
            >
              Save preferences
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCustomizing(true)}
              className="px-4 py-2 rounded-xl border border-slate-300 font-semibold"
            >
              Customize
            </button>
          )}
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false })}
            className="px-4 py-2 rounded-xl border border-slate-300 font-semibold"
          >
            Reject optional cookies
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: true, marketing: true })}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
