# Rentals Kenya: Security, Cookie & Privacy Audit (October 2026)

Scope: Next.js 14 app (`src/`), Prisma schema, Supabase SQL, Vercel config. This review reduces risk but does **not** mean the site is completely secure. The live Supabase database was **not** inspected directly; RLS findings come from the code and the SQL schema and must be confirmed by running `supabase/security_hardening.sql`.

Testing: `tsc --noEmit`, `next build`, `npm audit`, and curl-based authorization tests against a local production build (`next start`) backed by a local PostgreSQL seeded with one admin, two users, a public and a hidden listing, and an enquiry owned by user A.

## Findings

| # | Finding | Severity | Fix applied | Test performed | Outstanding risk |
|---|---------|----------|-------------|----------------|------------------|
| 1 | Hardcoded JWT fallback secret in `auth.ts` and `middleware.ts`: if `JWT_SECRET` is unset, anyone can forge an admin session | Critical | `src/lib/jwt-secret.ts`: production refuses to sign/verify without a `JWT_SECRET` of at least 32 characters | Token signed with the old fallback secret is redirected to `/admin/login` | Confirm `JWT_SECRET` is set in Vercel (Production + Preview). Rotating it logs everyone out |
| 2 | Supabase exposes the `public` schema over its REST API to `anon`/`authenticated`. The schema SQL creates tables without RLS, so anyone with the (non-secret) anon key may be able to read `User` (password hashes, reset-token hashes), enquiries etc. | Critical (unverified on live DB) | `supabase/security_hardening.sql`: enable RLS on all public tables, drop API-role policies, revoke anon/authenticated privileges, lock storage writes to the service role. Prisma connects as the table owner, so the app keeps working | Not run against production (no DB access). The script has before/after audit queries and a curl test | **Must be run by you** in the Supabase SQL editor after a backup |
| 3 | Default admin password published in `README.md`, `prisma/seed.js` and `prisma/supabase_schema.sql` (bcrypt hash of the same password, also for `admin@rentalsinkenya.co.ke`) | High | Removed from README; seed now requires `ADMIN_SEED_PASSWORD`; SQL comment warns the hash is public | Review | **Change the password on both admin accounts in production now.** It remains in git history |
| 4 | Admin access relied on middleware that only checked the token signature, not the role. Admin server pages (`/admin`, `/admin/audit-logs`, `/admin/properties/[id]/edit`) queried the DB without a server-side admin check, so a normal user who copied their session token into the admin cookie could view dashboard stats, audit logs and listing edit data | High | Middleware requires `role === 'ADMIN'`; those pages call the new `requireAdmin()`, which re-checks role and status in the database | User token in admin cookie → 307 to login; user token on admin APIs → 401; admin → 200 | None known |
| 5 | Vulnerable dependencies: `next@14.2.35` (critical advisories incl. middleware/image/cache issues), bundled `postcss`, `zod@3` | High | `npm audit fix` (non-breaking) applied | `npm audit --omit=dev`: 3 remain (1 critical, 2 high) | Fixes need Next.js 15/16 and Zod 4 (breaking changes). Recommend a separate upgrade PR |
| 6 | No rate limiting beyond a per-account login lockout (brute force, signup/reset/email spam, enquiry spam) | Medium | Per-IP limits in middleware for auth, enquiries, viewings, uploads and all mutating API calls | 11th login attempt in 10 min → 429 | In-memory, per server instance, so best effort on Vercel. Consider Vercel WAF rate limiting or Upstash Redis |
| 7 | CSRF protection relied only on `SameSite=Lax` cookies | Medium | Mutating `/api/*` requests with a foreign `Origin`/`Referer` are rejected | Cross-origin POST → 403 | None known |
| 8 | Hidden listings leaked via `/api/properties`, `/api/rentals` (incl. `?status=HIDDEN`) and `/api/{properties,rentals}/[id]` | Medium | Non-admins never get `HIDDEN` listings; viewing requests for hidden/nonexistent listings are rejected | Anon: 0 hidden in lists, 404 by id; admin still sees them | None known |
| 9 | API errors returned raw `error.message` (Prisma/DB internals) | Medium | `src/lib/http.ts` `errorResponse()`: validation messages only; other errors logged server-side, generic message returned | Malformed request → generic error | None known |
| 10 | Upload trusted the client MIME type and kept the client's file extension (an HTML/SVG payload labelled `image/png`, or a `.html` name, could be served from our domain/bucket) | Medium | Magic-byte check for JPEG/PNG/WEBP/AVIF; extension derived from the verified type; random filename | Script labelled PNG → 400; real PNG named `x.html` stored as `.png` | Images are not re-encoded (EXIF metadata such as GPS is kept) |
| 11 | User input (names, messages, property titles) inserted into email HTML unescaped | Medium | `escapeHtml()` in `src/lib/email.ts` | Code review | None known |
| 12 | Without an email provider in production, verification codes and reset links were written to logs | Medium | Production no longer logs email bodies | Code review | Make sure `RESEND_API_KEY`/`EMAIL_API_KEY` is set, or users cannot verify or reset |
| 13 | Open redirect via `?redirect=` on `/login` and `/admin/login` | Low | Only same-site relative paths accepted | Code review | None known |
| 14 | No Content-Security-Policy; deprecated `X-XSS-Protection: 1`; `X-Powered-By` header | Low | CSP, COOP, stricter Permissions-Policy, `X-XSS-Protection: 0`, `poweredByHeader: false` | Headers checked on production build | CSP allows `'unsafe-inline'` scripts (needed by Next.js without nonces) |
| 15 | JSON-LD `<script>` built from listing data could be broken out of with `</script>` | Low | `<` escaped in the JSON-LD | Code review | None known |
| 16 | No length limits on free-text input; numbers not checked for finiteness; enquiry/viewing status and notes accepted any value | Low | Zod `.max()` limits, `.finite()`, image URLs must be `https://` or site-relative, status allow-lists | 6,000-character message → 400; invalid status → 400 | None known |
| 17 | Viewing request API returned the full stored record | Low | Returns only the new ID | Response checked | Viewing requests remain open to anonymous users (rate-limited) |
| 18 | JWT sessions (7 days) are stateless: logout, password reset or disabling a user does not revoke tokens already issued | Low | Admin checks already re-read role/status from the DB | — | A stolen user token stays valid until it expires. Consider a token version column |
| 19 | Cookie consent and Cookie Policy missing; Privacy Policy inaccurate (e.g. "only data you voluntarily provide", no processors, transfers, retention or DPA rights) | Compliance | Consent banner (Accept all / Reject optional / Customize), persistent "Cookie Settings" footer link, `/cookies` page, rewritten `/privacy` page | Pages render; consent stored only in a first-party cookie for 180 days | Have the policies reviewed by a Kenyan data-protection adviser; confirm the contact mailbox; register with the ODPC if required |
| 20 | Service-role key exposure | — (no issue found) | — | Used only in server-side `src/lib/storage.ts`; no `NEXT_PUBLIC_` secret variables | Keep it out of client code and `NEXT_PUBLIC_*` variables |

## Cookie & tracking audit

| Item | Found |
|------|-------|
| `rentals_user_token`, `rentals_admin_token` | HttpOnly, Secure (prod), SameSite=Lax, 7 days. Strictly necessary |
| `rk_cookie_consent` (new) | Consent choice, 180 days. Strictly necessary |
| localStorage / sessionStorage | Not used |
| Analytics / ads / tag managers / third-party scripts | None found |
| Third-party content | Property images from Supabase Storage; outbound WhatsApp/tel/mailto links only |

Optional categories are off by default. `hasConsent()` in `src/lib/cookie-consent.ts` must gate any analytics added later.

## Actions for the site owner

1. Back up the database, then run `supabase/security_hardening.sql` in the Supabase SQL editor and check the "after" results.
2. Change the passwords for `admin@rentals.ke` and `admin@rentalsinkenya.co.ke`.
3. Confirm `JWT_SECRET` (32+ random characters) and the email API key are set in Vercel before deploying this change.
4. Plan the Next.js upgrade to clear the remaining dependency advisories.
