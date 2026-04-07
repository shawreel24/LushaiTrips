-- ═══════════════════════════════════════════════════════════════
--  LushaiTravels — Supabase Storage Buckets
--  Run this in the Supabase SQL Editor to create storage buckets.
-- ═══════════════════════════════════════════════════════════════

-- ── guide-images bucket ────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'guide-images',
  'guide-images',
  true,
  5242880,   -- 5 MB per file
  ARRAY['image/jpeg','image/jpg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ── stay-images bucket ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'stay-images',
  'stay-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ── transport-images bucket ────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'transport-images',
  'transport-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ── Storage policies — anyone can read, only authed users can upload ──

-- guide-images: public read
CREATE POLICY "guide-images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'guide-images');

-- guide-images: authenticated upload
CREATE POLICY "guide-images: auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'guide-images' AND auth.role() = 'authenticated');

-- stay-images: public read
CREATE POLICY "stay-images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stay-images');

-- stay-images: authenticated upload
CREATE POLICY "stay-images: auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'stay-images' AND auth.role() = 'authenticated');

-- transport-images: public read
CREATE POLICY "transport-images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'transport-images');

-- transport-images: authenticated upload
CREATE POLICY "transport-images: auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'transport-images' AND auth.role() = 'authenticated');
