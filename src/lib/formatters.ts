/**
 * Formats a number as Kenyan Shillings (KES)
 * e.g. 6800000 -> "KES 6,800,000"
 */
export function formatKES(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'KES 0';
  }
  return `KES ${Math.round(amount).toLocaleString('en-KE')}`;
}

/**
 * Clean phone number for WhatsApp wa.me links
 * Handles 07xx, +254xx, 254xx, international formats
 */
export function cleanPhoneForWhatsApp(phone: string | null | undefined): string {
  if (!phone) return '254100382352';
  // Remove all non-numeric characters
  let digits = phone.replace(/\D/g, '');

  // If starts with 0 and 10 digits total (e.g. 0712345678), convert to 254712345678
  if (digits.startsWith('0') && digits.length === 10) {
    digits = '254' + digits.substring(1);
  }

  return digits;
}

/**
 * Generate a direct WhatsApp click-to-chat URL with prefilled text
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

/**
 * Format date for Kenyan and international presentation
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format relative time or timestamp
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
