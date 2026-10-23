import type { Metadata } from 'next';
// @ts-ignore Next.js handles this global stylesheet import at build time.
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Rentals Kenya | Houses & Apartments for Rent in Kenya | Airbnb Setups',
    template: '%s | Rentals Kenya',
  },
  description:
    'Kenya\'s premier platform for rental apartments and houses, plus turnkey Airbnb business takeovers and furnished setups for sale across Nairobi and prime locations.',
  keywords: [
    'Apartments for rent Kenya',
    'Houses for rent Nairobi',
    'Rental houses Kenya',
    'Kilimani apartments for rent',
    'Westlands rentals Nairobi',
    'Airbnb business takeovers Kenya',
    'Furnished setups for sale Nairobi',
    'Rentals.ke',
    'Rentals Kenya',
  ],
  authors: [{ name: 'Rentals Kenya' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rentalsinkenya.co.ke'),
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://rentalsinkenya.co.ke',
    title: 'Rentals Kenya | Houses & Apartments for Rent in Kenya | Airbnb Setups',
    description:
      'Discover verified rental apartments and houses across Kenya, alongside turnkey Airbnb business takeovers and furnished setups for sale.',
    siteName: 'Rentals Kenya',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rentals Kenya | Houses & Apartments for Rent in Kenya | Airbnb Setups',
    description:
      'Discover verified rental apartments and houses across Kenya, alongside turnkey Airbnb business takeovers and furnished setups for sale.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
