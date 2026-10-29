'use client';

import React from 'react';
import { openCookieSettings } from '@/lib/cookie-consent';

export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie Settings
    </button>
  );
}
