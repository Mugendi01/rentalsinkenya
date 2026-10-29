-- =====================================================================
-- Rentals Kenya - Supabase RLS / API exposure hardening
-- Run in the Supabase SQL editor (or psql against DIRECT_URL).
--
-- Why: the app reads and writes the database only through Prisma using the
-- table-owner role (postgres), which bypasses RLS. Supabase also exposes the
-- public schema through its REST/GraphQL APIs to the "anon" and
-- "authenticated" roles. If RLS is off, anyone with the project's anon key
-- could read or change tables such as "User" (password hashes, reset tokens).
--
-- What this does: enables RLS on every application table with NO policies for
-- anon/authenticated (deny-all through the API) and revokes their table
-- privileges. Prisma keeps working because it connects as the table owner and
-- RLS is not FORCED. Images keep working because the property-images bucket is
-- public-read and uploads use the server-side service-role key.
--
-- Safe to re-run. Wrapped in a transaction; take a backup first
-- (Supabase Dashboard -> Database -> Backups).
-- =====================================================================

-- 0. Audit BEFORE (copy the results into the audit report)
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
ORDER BY 1;

SELECT grantee, table_name, string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privileges
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated')
GROUP BY grantee, table_name ORDER BY table_name, grantee;

SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies WHERE schemaname IN ('public', 'storage') ORDER BY schemaname, tablename;

BEGIN;

-- 1. Enable RLS (deny-by-default) on every table in public
DO $$
DECLARE t record;
BEGIN
  FOR t IN
    SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.relname);
  END LOOP;
END $$;

-- 2. Remove any permissive policies previously granted to API roles on public tables
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND roles && ARRAY['anon', 'authenticated', 'public']::name[]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

-- 3. Revoke direct API access (the app never uses the anon/authenticated roles)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated, public;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated, public;

-- 4. Storage: property-images is public-read by design (listing photos).
--    Ensure only the service role (server) can write/modify/delete.
UPDATE storage.buckets
SET public = true,
    file_size_limit = 8388608,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
WHERE id = 'property-images';

DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND roles && ARRAY['anon', 'authenticated', 'public']::name[]
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      AND (coalesce(qual, '') ILIKE '%property-images%' OR coalesce(with_check, '') ILIKE '%property-images%'
           OR (coalesce(qual, '') NOT ILIKE '%bucket_id%' AND coalesce(with_check, '') NOT ILIKE '%bucket_id%'))
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

COMMIT;

-- 5. Audit AFTER - expected: rls_enabled = true for every table, no rows for
--    anon/authenticated grants, no public-schema policies, and no storage
--    INSERT/UPDATE/DELETE policies for anon/authenticated.
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p') ORDER BY 1;

SELECT grantee, table_name, privilege_type FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated');

SELECT schemaname, tablename, policyname, roles, cmd FROM pg_policies
WHERE schemaname IN ('public', 'storage') ORDER BY 1, 2;

-- Views / functions that could bypass RLS (review any rows returned)
SELECT n.nspname, p.proname, p.prosecdef AS security_definer
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public';
SELECT table_name FROM information_schema.views WHERE table_schema = 'public';

-- 6. Anonymous API test (run from your own machine; replace placeholders).
--    Expected after this script: HTTP 401/403 or an empty/permission error, never user rows.
--    curl "https://<PROJECT-REF>.supabase.co/rest/v1/User?select=email,passwordHash" \
--      -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>"
