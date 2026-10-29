export const CONSENT_COOKIE_NAME = 'rk_cookie_consent';
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180;
export const OPEN_COOKIE_SETTINGS_EVENT = 'rk:open-cookie-settings';
export const CONSENT_CHANGED_EVENT = 'rk:cookie-consent-changed';

export type OptionalCookieCategory = 'analytics' | 'marketing';

export interface CookieConsent {
  v: number;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export function readConsent(): CookieConsent | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split('=')[1];
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed?.v !== CONSENT_VERSION) return null;
    return {
      v: CONSENT_VERSION,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: String(parsed.updatedAt || ''),
    };
  } catch {
    return null;
  }
}

export function writeConsent(choice: Pick<CookieConsent, OptionalCookieCategory>): CookieConsent {
  const consent: CookieConsent = {
    v: CONSENT_VERSION,
    analytics: choice.analytics,
    marketing: choice.marketing,
    updatedAt: new Date().toISOString(),
  };
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${
    CONSENT_MAX_AGE_DAYS * 24 * 60 * 60
  }; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: consent }));
  return consent;
}

/** Optional scripts (analytics, marketing pixels) must check this before loading. */
export function hasConsent(category: OptionalCookieCategory): boolean {
  return readConsent()?.[category] === true;
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
