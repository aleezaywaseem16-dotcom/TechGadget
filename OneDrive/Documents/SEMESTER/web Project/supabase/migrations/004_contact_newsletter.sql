-- ════════════════════════════════════════════════════════════════════════════
-- Run this ENTIRE block in Supabase Dashboard → SQL Editor → New Query → Run
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. Contact Messages ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'service_role');

-- ── 2. Newsletter Subscriptions ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        UNIQUE NOT NULL,
  is_active  BOOLEAN     DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can upsert their own subscription"
  ON newsletter_subscriptions FOR UPDATE
  USING (true);

-- ── 3. Fix product prices (run separately after confirming column name) ────────
-- First, run this to confirm exact column names and price format:
--
-- SELECT slug, price, compare_at_price
-- FROM products
-- WHERE slug IN ('hp-spectre-x360-14', 'macbook-air-13-m3')
-- LIMIT 2;
--
-- If the working product (macbook-air-13-m3) shows price as e.g. 269999
-- then prices are stored as whole PKR — use the values below as-is.
--
-- UPDATE products SET price = 339999, compare_at_price = 379999  WHERE slug = 'hp-spectre-x360-14';
-- UPDATE products SET price = 329999, compare_at_price = NULL    WHERE slug = 'lenovo-thinkpad-x1-carbon-gen12';
-- UPDATE products SET price = 649999, compare_at_price = NULL    WHERE slug = 'macbook-pro-16-m4-pro';
-- UPDATE products SET price = 789999, compare_at_price = NULL    WHERE slug = 'asus-rog-zephyrus-g16';
-- UPDATE products SET price = 89999,  compare_at_price = 99999   WHERE slug = 'samsung-galaxy-a56';
-- UPDATE products SET price = 129999, compare_at_price = 149999  WHERE slug = 'oneplus-13';
-- UPDATE products SET price = 119999, compare_at_price = 134999  WHERE slug = 'xiaomi-14t-pro';
-- UPDATE products SET price = 369999, compare_at_price = NULL    WHERE slug = 'samsung-galaxy-s25-ultra';
-- UPDATE products SET price = 224999, compare_at_price = 259999  WHERE slug = 'sony-xperia-1-vii';
-- UPDATE products SET price = 34999,  compare_at_price = 39999   WHERE slug = 'logitech-g915-tkl-wireless';
-- UPDATE products SET price = 27999,  compare_at_price = 34999   WHERE slug = 'razer-kraken-v3-hypersense';
-- UPDATE products SET price = 24999,  compare_at_price = NULL    WHERE slug = 'logitech-g-pro-x-superlight-2';
