-- ============================================================
-- Seed data: Categories, Brands, Sample Products
-- Run AFTER 001_schema.sql and 002_rls.sql
-- ============================================================

-- ── Categories ───────────────────────────────────────────────
insert into categories (name, slug, description, image_url) values
  ('Smartphones',           'smartphones',           'Latest flagship and mid-range smartphones', null),
  ('Laptops',               'laptops',               'Powerful laptops for work, school and gaming', null),
  ('Gaming',                'gaming',                'Gaming consoles, PCs, accessories and gear', null),
  ('Smart Watches',         'smart-watches',         'Fitness trackers and smartwatches', null),
  ('Audio Devices',         'audio-devices',         'Headphones, earbuds, speakers and more', null),
  ('Cameras',               'cameras',               'DSLRs, mirrorless, action cameras and accessories', null),
  ('Computer Accessories',  'computer-accessories',  'Keyboards, mice, monitors, hubs and peripherals', null),
  ('Mobile Accessories',    'mobile-accessories',    'Cases, chargers, cables and screen protectors', null),
  ('Smart Home',            'smart-home',            'Smart bulbs, plugs, speakers and home automation', null)
on conflict (slug) do nothing;

-- ── Brands ───────────────────────────────────────────────────
insert into brands (name, slug) values
  ('Apple',       'apple'),
  ('Samsung',     'samsung'),
  ('Sony',        'sony'),
  ('LG',          'lg'),
  ('Dell',        'dell'),
  ('HP',          'hp'),
  ('Lenovo',      'lenovo'),
  ('Asus',        'asus'),
  ('Xiaomi',      'xiaomi'),
  ('OnePlus',     'oneplus'),
  ('Google',      'google'),
  ('Microsoft',   'microsoft'),
  ('Logitech',    'logitech'),
  ('Bose',        'bose'),
  ('JBL',         'jbl'),
  ('Razer',       'razer'),
  ('SteelSeries', 'steelseries'),
  ('Anker',       'anker'),
  ('Fitbit',      'fitbit'),
  ('Garmin',      'garmin')
on conflict (slug) do nothing;

-- ── Sample Products ──────────────────────────────────────────
-- Products reference categories and brands by slug for readability.
-- We use a DO block to look up UUIDs.

do $$
declare
  cat_smartphones   uuid := (select id from categories where slug = 'smartphones');
  cat_laptops       uuid := (select id from categories where slug = 'laptops');
  cat_gaming        uuid := (select id from categories where slug = 'gaming');
  cat_watches       uuid := (select id from categories where slug = 'smart-watches');
  cat_audio         uuid := (select id from categories where slug = 'audio-devices');
  cat_cameras       uuid := (select id from categories where slug = 'cameras');
  cat_computer      uuid := (select id from categories where slug = 'computer-accessories');

  brand_apple   uuid := (select id from brands where slug = 'apple');
  brand_samsung uuid := (select id from brands where slug = 'samsung');
  brand_sony    uuid := (select id from brands where slug = 'sony');
  brand_dell    uuid := (select id from brands where slug = 'dell');
  brand_asus    uuid := (select id from brands where slug = 'asus');
  brand_bose    uuid := (select id from brands where slug = 'bose');
  brand_razer   uuid := (select id from brands where slug = 'razer');
  brand_logitech uuid := (select id from brands where slug = 'logitech');
begin

  -- Smartphones (PKR prices — Pakistani market rates)
  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'iPhone 16 Pro Max', 'iphone-16-pro-max',
    'Apple''s most powerful iPhone with the A18 Pro chip, titanium design, and a 48MP camera system with 5× optical zoom.',
    '{"Display": "6.9\" OLED Super Retina XDR", "Chip": "A18 Pro", "Storage": "256GB–1TB", "Camera": "48MP main + 48MP ultra-wide + 12MP 5× telephoto", "Battery": "Up to 33 hours video playback", "OS": "iOS 18"}',
    349999, 389999, cat_smartphones, brand_apple, 45, 'APPL-IP16PM-256', true, true, 'active'
  ) on conflict (slug) do nothing;

  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Samsung Galaxy S25 Ultra', 'samsung-galaxy-s25-ultra',
    'The ultimate Galaxy with a built-in S Pen, 200MP camera, and Snapdragon 8 Elite.',
    '{"Display": "6.9\" Dynamic AMOLED 2X 120Hz", "Chip": "Snapdragon 8 Elite", "Storage": "256GB–1TB", "Camera": "200MP main + 50MP periscope zoom", "Battery": "5000mAh", "OS": "Android 15 (One UI 7)"}',
    369999, null, cat_smartphones, brand_samsung, 30, 'SAMG-S25U-256', true, true, 'active'
  ) on conflict (slug) do nothing;

  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Sony Xperia 1 VII', 'sony-xperia-1-vii',
    'Professional-grade mobile photography with a 52mm f/1.9 Zeiss lens and 4K 120fps video.',
    '{"Display": "6.5\" 4K OLED 120Hz", "Chip": "Snapdragon 8 Elite", "Camera": "52mm f/1.9 Zeiss T*", "Battery": "5000mAh", "OS": "Android 15"}',
    224999, 259999, cat_smartphones, brand_sony, 20, 'SONY-XP1VII-256', false, true, 'active'
  ) on conflict (slug) do nothing;

  -- Laptops
  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'MacBook Pro 16" M4 Pro', 'macbook-pro-16-m4-pro',
    'Professional performance with M4 Pro chip, 24GB unified memory, and a stunning Liquid Retina XDR display.',
    '{"Display": "16.2\" Liquid Retina XDR", "Chip": "M4 Pro (14-core CPU)", "Memory": "24GB unified", "Storage": "512GB SSD", "Battery": "Up to 22 hours", "OS": "macOS Sequoia"}',
    649999, null, cat_laptops, brand_apple, 15, 'APPL-MBP16-M4P', true, false, 'active'
  ) on conflict (slug) do nothing;

  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Dell XPS 15', 'dell-xps-15',
    'Premium ultrabook with Intel Core Ultra 9, OLED touch display, and NVIDIA RTX 4070.',
    '{"Display": "15.6\" OLED 3.5K Touch", "CPU": "Intel Core Ultra 9 185H", "GPU": "NVIDIA RTX 4070 8GB", "Memory": "32GB DDR5", "Storage": "1TB SSD", "OS": "Windows 11 Pro"}',
    549999, 619999, cat_laptops, brand_dell, 22, 'DELL-XPS15-9530', false, false, 'active'
  ) on conflict (slug) do nothing;

  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'ASUS ROG Zephyrus G16', 'asus-rog-zephyrus-g16',
    'Ultra-slim gaming powerhouse with AMD Ryzen AI 9 and RTX 4090.',
    '{"Display": "16\" QHD+ OLED 240Hz", "CPU": "AMD Ryzen AI 9 HX 370", "GPU": "NVIDIA RTX 4090 16GB", "Memory": "32GB DDR5", "Storage": "2TB SSD", "Battery": "90Wh"}',
    789999, null, cat_laptops, brand_asus, 10, 'ASUS-ROG-ZG16-R9', true, true, 'active'
  ) on conflict (slug) do nothing;

  -- Gaming
  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Razer DeathAdder V3 Pro', 'razer-deathadder-v3-pro',
    'Ergonomic wireless gaming mouse with Focus Pro 30K optical sensor and 90-hour battery.',
    '{"Sensor": "Razer Focus Pro 30K", "DPI": "100–30,000", "Buttons": "5 + scroll", "Battery": "Up to 90 hours", "Weight": "64g", "Wireless": "HyperSpeed 2.4GHz"}',
    29999, 34999, cat_gaming, brand_razer, 80, 'RAZR-DAV3P-BLK', false, false, 'active'
  ) on conflict (slug) do nothing;

  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Logitech G Pro X Superlight 2', 'logitech-g-pro-x-superlight-2',
    'Ultra-lightweight wireless mouse at 60g with HERO 2 sensor.',
    '{"Sensor": "HERO 2", "DPI": "100–44,000", "Buttons": "5", "Battery": "Up to 95 hours", "Weight": "60g", "Wireless": "LIGHTSPEED 2.4GHz"}',
    24999, null, cat_gaming, brand_logitech, 60, 'LOGI-GPX2SL-WHT', true, false, 'active'
  ) on conflict (slug) do nothing;

  -- Audio
  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Sony WH-1000XM6', 'sony-wh-1000xm6',
    'Industry-leading noise cancellation with 40-hour battery and Hi-Res Audio.',
    '{"Type": "Over-ear wireless", "ANC": "Industry-leading", "Battery": "40 hours", "Driver": "40mm", "Codec": "LDAC, AAC, SBC", "Folding": "Yes"}',
    89999, 109999, cat_audio, brand_sony, 50, 'SONY-WH1000XM6-BLK', true, true, 'active'
  ) on conflict (slug) do nothing;

  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Bose QuietComfort 45', 'bose-quietcomfort-45',
    'Premium noise-cancelling headphones with TriPort acoustic architecture.',
    '{"Type": "Over-ear wireless", "ANC": "Bose Acoustic Noise Cancelling", "Battery": "24 hours", "Modes": "Quiet, Aware", "Codec": "AAC, SBC"}',
    64999, 79999, cat_audio, brand_bose, 35, 'BOSE-QC45-WHT', false, false, 'active'
  ) on conflict (slug) do nothing;

  -- Camera
  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Sony A7C II', 'sony-a7c-ii',
    'Full-frame mirrorless camera in a compact body with 33MP sensor and AI-based subject recognition.',
    '{"Sensor": "33MP Exmor R BSI CMOS", "Video": "4K 60fps", "Stabilization": "7-stop IBIS", "AF Points": "759-point phase-detect", "Battery": "Approx 550 shots", "Weight": "514g"}',
    599999, null, cat_cameras, brand_sony, 12, 'SONY-A7CII-BODY', true, false, 'active'
  ) on conflict (slug) do nothing;

  -- Smart Watches
  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Apple Watch Series 10', 'apple-watch-series-10',
    'Thinnest Apple Watch ever with sleep apnea detection and 18-hour battery.',
    '{"Display": "46mm Always-On Retina LTPO", "Chip": "S10", "Health": "ECG, Blood Oxygen, Sleep Apnea", "Water Resistance": "50m", "Battery": "18 hours", "OS": "watchOS 11"}',
    109999, 129999, cat_watches, brand_apple, 40, 'APPL-WS10-46-ALU', true, true, 'active'
  ) on conflict (slug) do nothing;

  -- Computer Accessories
  insert into products (name, slug, description, specs, price, compare_at_price, category_id, brand_id, stock_quantity, sku, is_featured, is_new_arrival, status)
  values (
    'Logitech MX Keys S', 'logitech-mx-keys-s',
    'Advanced wireless keyboard with Smart Illumination, flow multi-device typing and USB-C charging.',
    '{"Layout": "Full-size with numpad", "Backlight": "Smart per-key", "Battery": "Up to 10 days", "Connectivity": "Bluetooth LE + USB-A dongle", "OS": "Windows, macOS, Linux"}',
    24999, 29999, cat_computer, brand_logitech, 55, 'LOGI-MXKEYS-S-GRP', false, false, 'active'
  ) on conflict (slug) do nothing;

end $$;

-- ── Product Images ────────────────────────────────────────────
-- Each product gets 1–2 realistic Unsplash photos that match what it actually is.
insert into product_images (product_id, url, alt, position)
select p.id, img.url, img.alt, img.position
from products p
join (values
  -- iPhone 16 Pro Max — titanium-colored phone on dark bg
  ('iphone-16-pro-max',       'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&auto=format', 'iPhone 16 Pro Max Titanium', 1),
  ('iphone-16-pro-max',       'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&h=600&fit=crop&auto=format', 'iPhone 16 Pro Max Camera System', 2),

  -- Samsung Galaxy S25 Ultra — Android flagship
  ('samsung-galaxy-s25-ultra','https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop&auto=format', 'Samsung Galaxy S25 Ultra', 1),

  -- Sony Xperia 1 VII
  ('sony-xperia-1-vii',       'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop&auto=format', 'Sony Xperia 1 VII', 1),

  -- MacBook Pro 16"
  ('macbook-pro-16-m4-pro',   'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&auto=format', 'MacBook Pro 16 M4 Pro', 1),
  ('macbook-pro-16-m4-pro',   'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&auto=format', 'MacBook Pro keyboard detail', 2),

  -- Dell XPS 15
  ('dell-xps-15',             'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop&auto=format', 'Dell XPS 15 laptop', 1),
  ('dell-xps-15',             'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&auto=format', 'Dell XPS 15 open', 2),

  -- ASUS ROG Zephyrus G16 — gaming laptop, dark chassis
  ('asus-rog-zephyrus-g16',   'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=600&h=600&fit=crop&auto=format', 'ASUS ROG Zephyrus G16 gaming laptop', 1),
  ('asus-rog-zephyrus-g16',   'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=600&h=600&fit=crop&auto=format', 'ASUS ROG gaming keyboard', 2),

  -- Razer DeathAdder V3 Pro — gaming mouse
  ('razer-deathadder-v3-pro', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop&auto=format', 'Razer DeathAdder V3 Pro gaming mouse', 1),

  -- Logitech G Pro X Superlight 2 — white mouse
  ('logitech-g-pro-x-superlight-2','https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop&auto=format', 'Logitech G Pro X Superlight 2', 1),

  -- Sony WH-1000XM6 — over-ear headphones
  ('sony-wh-1000xm6',         'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format', 'Sony WH-1000XM6 headphones', 1),
  ('sony-wh-1000xm6',         'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&auto=format', 'Sony headphones side view', 2),

  -- Bose QuietComfort 45 — white headphones
  ('bose-quietcomfort-45',    'https://images.unsplash.com/photo-1546435770-a3e736769b31?w=600&h=600&fit=crop&auto=format', 'Bose QuietComfort 45 headphones', 1),

  -- Sony A7C II — mirrorless camera with lens
  ('sony-a7c-ii',             'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&auto=format', 'Sony A7C II mirrorless camera', 1),
  ('sony-a7c-ii',             'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=600&h=600&fit=crop&auto=format', 'Sony camera lens close-up', 2),

  -- Apple Watch Series 10
  ('apple-watch-series-10',   'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&h=600&fit=crop&auto=format', 'Apple Watch Series 10', 1),
  ('apple-watch-series-10',   'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop&auto=format', 'Apple Watch on wrist', 2),

  -- Logitech MX Keys S — full-size keyboard
  ('logitech-mx-keys-s',      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&auto=format', 'Logitech MX Keys S keyboard', 1),
  ('logitech-mx-keys-s',      'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=600&h=600&fit=crop&auto=format', 'Keyboard close-up', 2)

) as img(slug, url, alt, position) on p.slug = img.slug
on conflict do nothing;
