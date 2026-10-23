import prisma from './prisma';

export interface SiteSettingsMap {
  company_name: string;
  brand_name: string;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  office_address: string;
  business_hours: string;
  instagram_handle: string;
  instagram_url: string;
  default_currency: string;
  meta_title: string;
  meta_description: string;
  google_maps_embed?: string;
  [key: string]: string | undefined;
}

export const DEFAULT_SETTINGS: SiteSettingsMap = {
  company_name: 'Rentals Kenya',
  brand_name: 'Rentals.ke',
  whatsapp_number: process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || '254100382352',
  phone_number: process.env.NEXT_PUBLIC_DEFAULT_PHONE || '+254100382352',
  email: process.env.NEXT_PUBLIC_DEFAULT_EMAIL || 'invest@rentals.ke',
  office_address: 'The Oval, 4th Floor, Ring Road Parklands, Westlands, Nairobi, Kenya',
  business_hours: 'Mon - Sat: 8:00 AM - 6:00 PM EAT',
  instagram_handle: 'rentals.kenya',
  instagram_url: 'https://instagram.com/rentals.kenya',
  default_currency: 'KES',
  meta_title: 'Rentals Kenya | Houses & Apartments for Rent in Kenya | Turnkey Airbnb Setups',
  meta_description: 'Discover verified rental houses and apartments across Nairobi and Kenya, along with turnkey Airbnb business takeovers and furnished setups for sale.',
};

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const result: Partial<SiteSettingsMap> = {};
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return {
      ...DEFAULT_SETTINGS,
      ...result,
    };
  } catch (error) {
    console.error('Error fetching site settings, falling back to defaults:', error);
    return DEFAULT_SETTINGS;
  }
}
