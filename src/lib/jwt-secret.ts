const DEV_FALLBACK_SECRET = 'rentals_kenya_local_development_only_secret';

/**
 * Returns the HMAC key used to sign session JWTs. In production a strong JWT_SECRET
 * must be configured; a hardcoded fallback would let anyone forge admin sessions.
 */
export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a random string of at least 32 characters in production.');
  }
  return new TextEncoder().encode(secret || DEV_FALLBACK_SECRET);
}
