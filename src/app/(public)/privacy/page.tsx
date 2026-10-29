import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rentals Kenya (Rentals.ke)',
  description: 'How Rentals Kenya collects, uses, shares and protects personal data under the Kenya Data Protection Act, 2019.',
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base font-bold text-slate-900 pt-2">{children}</h2>
);

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const email = settings.email;

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 border-b pb-4">Privacy Policy</h1>
        <p className="text-slate-500 text-xs">
          Last updated: October 2026 &bull; Prepared with reference to the Kenya Data Protection Act, 2019
        </p>

        <H2>1. Who we are</H2>
        <p>
          Rentals Kenya (Rentals.ke) operates this website, which lists rental houses and apartments and Airbnb
          business takeovers and furnished setups in Kenya. We decide why and how your personal data is processed on
          this website, which makes us the data controller. You can contact us at{' '}
          <a href={`mailto:${email}`} className="text-sky-600 underline">{email}</a> or at our office:{' '}
          {settings.office_address}.
        </p>

        <H2>2. Personal data we collect</H2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Account details</strong> when you register: full name, email address, phone number, country (optional),
            preferred contact method, and your password (stored only as a one-way bcrypt hash, never in readable form).
          </li>
          <li>
            <strong>Account security data:</strong> email verification codes and password-reset tokens (stored as hashes
            and set to expire), verification status, failed login counts and temporary lockouts.
          </li>
          <li>
            <strong>Enquiries:</strong> name, phone, email, preferred contact method, investment purpose, budget,
            preferred viewing date, your message and questions, and the listing you asked about.
          </li>
          <li>
            <strong>Viewing requests:</strong> name, phone, email, preferred date and time, message, and the listing.
          </li>
          <li><strong>Saved listings</strong> you bookmark while signed in.</li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, requested pages and timestamps, recorded in server
            and security logs by our hosting provider, plus the cookies described in our{' '}
            <Link href="/cookies" className="text-sky-600 underline">Cookie Policy</Link>.
          </li>
          <li>
            <strong>Staff data:</strong> for administrators, a log of admin actions (such as editing listings or
            enquiries).
          </li>
        </ul>
        <p>We do not use analytics or advertising trackers, and we do not knowingly collect data from children.</p>

        <H2>3. Why we use your data and our lawful basis</H2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-50 text-slate-900">
              <tr><th className="p-2 border-b">Purpose</th><th className="p-2 border-b">Lawful basis</th></tr>
            </thead>
            <tbody className="align-top">
              <tr><td className="p-2 border-b">Creating and running your account, verifying your email, password resets</td><td className="p-2 border-b">Performance of a contract (our terms of use)</td></tr>
              <tr><td className="p-2 border-b">Responding to enquiries and arranging viewings</td><td className="p-2 border-b">Steps taken at your request before entering a contract; legitimate interests</td></tr>
              <tr><td className="p-2 border-b">Sending service emails (codes, confirmations, reset links)</td><td className="p-2 border-b">Performance of a contract</td></tr>
              <tr><td className="p-2 border-b">Security: preventing fraud, spam and unauthorised access; rate limiting; logs</td><td className="p-2 border-b">Legitimate interests in keeping the service secure</td></tr>
              <tr><td className="p-2 border-b">Optional cookies (none currently used)</td><td className="p-2 border-b">Consent</td></tr>
              <tr><td className="p-2 border-b">Keeping records required by law and handling disputes</td><td className="p-2 border-b">Legal obligation; legitimate interests</td></tr>
            </tbody>
          </table>
        </div>
        <p>We do not sell your personal data and do not use it for automated decisions that significantly affect you.</p>

        <H2>4. Who we share data with</H2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Supabase</strong> — hosts our database and property image storage.</li>
          <li><strong>Vercel</strong> — hosts and serves the website and keeps request logs.</li>
          <li>
            <strong>Resend</strong> — our email delivery provider, which receives your email address, name and email
            content when we send you a message.
          </li>
          <li>
            <strong>Our staff</strong>, and where you proceed with a property, the landlord, agent, seller or legal
            advisers involved, to the extent needed for your request.
          </li>
          <li>Authorities where required by law.</li>
        </ul>
        <p>
          If you choose to contact us by WhatsApp or phone, that conversation is also handled by the relevant provider
          (for example WhatsApp/Meta) under its own terms.
        </p>

        <H2>5. International transfers</H2>
        <p>
          Our service providers operate infrastructure outside Kenya (for example in the United States or the European
          Union). Your data may therefore be transferred to and stored outside Kenya. We rely on these providers&rsquo;
          contractual data-protection terms and security safeguards for such transfers, as permitted by the Data
          Protection Act, 2019.
        </p>

        <H2>6. How long we keep data</H2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account data: while your account is active. You can ask us to delete it at any time.</li>
          <li>Enquiries and viewing requests: for as long as needed to handle your request and any follow-up, after
            which we review and delete or anonymise them when they are no longer needed.</li>
          <li>Verification codes expire after 10 minutes and reset links after a short period.</li>
          <li>Hosting request logs are kept for the limited period set by our hosting provider.</li>
          <li>Cookie choices: up to 180 days in your browser.</li>
        </ul>
        <p>
          Deletion is currently carried out manually by our team on request or during periodic reviews; it is not yet
          automated.
        </p>

        <H2>7. How we protect your data</H2>
        <p>
          Safeguards include HTTPS for all traffic, hashed passwords and one-time codes, HttpOnly session cookies,
          server-side access checks so that only administrators can manage listings and view enquiries, login lockouts
          and request rate limiting, and restricted access to our database keys. No system is perfectly secure, and we
          cannot guarantee absolute security, but we will notify you and the Data Commissioner of a breach where the law
          requires.
        </p>

        <H2>8. Your rights</H2>
        <p>Under the Data Protection Act, 2019 you have the right to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>be informed of how your data is used;</li>
          <li>access the personal data we hold about you;</li>
          <li>object to the processing of all or part of your data;</li>
          <li>have false or misleading data corrected;</li>
          <li>have false, misleading or unlawfully processed data deleted, and ask us to delete your account;</li>
          <li>receive your data in a portable format where applicable; and</li>
          <li>withdraw consent at any time, where processing is based on consent.</li>
        </ul>
        <p>
          You can update most account details from your dashboard. For other requests, email{' '}
          <a href={`mailto:${email}`} className="text-sky-600 underline">{email}</a> with the subject &ldquo;Privacy
          request&rdquo;. We may need to verify your identity, and we aim to respond within the timelines required by
          law. If you are unhappy with our response, you can complain to the Office of the Data Protection Commissioner
          (ODPC) at <a href="https://www.odpc.go.ke" className="text-sky-600 underline" rel="noopener noreferrer" target="_blank">www.odpc.go.ke</a>.
        </p>

        <H2>9. Changes to this policy</H2>
        <p>We will update this page when our practices change and revise the date at the top.</p>
      </div>
    </div>
  );
}
