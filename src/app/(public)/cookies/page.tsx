import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CookieSettingsButton from '@/components/privacy/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'Cookie Policy | Rentals Kenya (Rentals.ke)',
  description: 'Which cookies Rentals Kenya uses, why, for how long, and how to change your choices.',
};

const COOKIES = [
  {
    name: 'rentals_user_token',
    category: 'Strictly necessary',
    purpose: 'Keeps you signed in to your Rentals Kenya account after you log in.',
    duration: '7 days, or until you log out',
    provider: 'Rentals Kenya (first party)',
  },
  {
    name: 'rentals_admin_token',
    category: 'Strictly necessary',
    purpose: 'Keeps authorised staff signed in to the admin portal.',
    duration: '7 days, or until logout',
    provider: 'Rentals Kenya (first party)',
  },
  {
    name: 'rk_cookie_consent',
    category: 'Strictly necessary',
    purpose: 'Remembers your cookie choices so we do not ask on every visit.',
    duration: '180 days',
    provider: 'Rentals Kenya (first party)',
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 border-b pb-4">Cookie Policy</h1>
        <p className="text-slate-500 text-xs">Last updated: October 2026</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">1. What cookies are</h2>
        <p>
          Cookies are small text files that a website stores in your browser. This policy explains the cookies used on
          Rentals Kenya (Rentals.ke) and how you can control them. It should be read together with our{' '}
          <Link href="/privacy" className="text-sky-600 underline">Privacy Policy</Link>.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">2. Cookie categories</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Strictly necessary:</strong> required for sign-in, security and remembering your cookie choice.
            These cannot be switched off because the site cannot work properly without them.
          </li>
          <li>
            <strong>Analytics (optional):</strong> would help us understand how visitors use the site.{' '}
            <strong>We do not currently use any analytics cookies.</strong>
          </li>
          <li>
            <strong>Marketing (optional):</strong> would be used to measure advertising.{' '}
            <strong>We do not currently use any marketing cookies.</strong>
          </li>
        </ul>
        <p>
          If we introduce optional cookies in future, they will only be set after you allow that category, and we will
          update this page first.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">3. Cookies we use</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Category</th>
                <th className="p-2 border-b">Purpose</th>
                <th className="p-2 border-b">Duration</th>
                <th className="p-2 border-b">Provider</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.name} className="align-top">
                  <td className="p-2 border-b font-mono">{c.name}</td>
                  <td className="p-2 border-b">{c.category}</td>
                  <td className="p-2 border-b">{c.purpose}</td>
                  <td className="p-2 border-b">{c.duration}</td>
                  <td className="p-2 border-b">{c.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The sign-in cookies are marked HttpOnly (not readable by page scripts), sent only over HTTPS in production,
          and restricted to same-site requests (SameSite=Lax). We do not use browser local storage or session storage
          to track you.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">4. Third parties</h2>
        <p>
          We do not load third-party analytics, advertising or social media tracking scripts. Our hosting provider
          (Vercel) and database and image storage provider (Supabase) process technical data such as IP addresses to
          deliver the site, as described in our Privacy Policy, but they do not set cookies through this website.
          Property photos are loaded from Supabase Storage. If you click a WhatsApp, phone or email link, you leave this
          site and the provider of that service (for example WhatsApp/Meta) applies its own cookie and privacy terms.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">5. Changing or withdrawing consent</h2>
        <p>
          You can change your choices at any time using the &ldquo;Cookie Settings&rdquo; link in the footer of every
          page, or here:{' '}
          <CookieSettingsButton className="text-sky-600 underline font-semibold" />. You can also delete cookies in your
          browser settings; deleting the sign-in cookies will log you out.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">6. Your consent record</h2>
        <p>
          Your cookie choice is stored only in the rk_cookie_consent cookie in your own browser, for up to 180 days. We
          do not store it on our servers. When it expires or you clear it, we will ask again.
        </p>
      </div>
    </div>
  );
}
