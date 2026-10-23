import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import { getSiteSettings } from '@/lib/settings';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        whatsappNumber={settings.whatsapp_number}
        phoneNumber={settings.phone_number}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp
        phone={settings.whatsapp_number}
        defaultMessage="Hello Rentals Kenya, I am browsing rental houses and apartments on Rentals.ke and would like to speak with an advisor."
      />
    </div>
  );
}
