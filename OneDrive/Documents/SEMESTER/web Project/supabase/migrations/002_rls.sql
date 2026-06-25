-- ============================================================
-- Row Level Security (RLS) Policies
-- Run AFTER 001_schema.sql
-- ============================================================

-- ── Helper: check if the current user is an admin ────────────
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin' and is_disabled = false
  );
$$;

-- ── Enable RLS on all tables ─────────────────────────────────
alter table profiles             enable row level security;
alter table addresses            enable row level security;
alter table categories           enable row level security;
alter table brands               enable row level security;
alter table products             enable row level security;
alter table product_images       enable row level security;
alter table reviews              enable row level security;
alter table wishlists            enable row level security;
alter table cart_items           enable row level security;
alter table orders               enable row level security;
alter table order_items          enable row level security;
alter table payments             enable row level security;
alter table newsletter_subscribers enable row level security;

-- ── profiles ─────────────────────────────────────────────────
create policy "profiles: read own"      on profiles for select using (auth.uid() = id);
create policy "profiles: update own"    on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles: admin read all" on profiles for select using (is_admin());
create policy "profiles: admin update"  on profiles for update using (is_admin());

-- ── addresses ────────────────────────────────────────────────
create policy "addresses: own user"   on addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "addresses: admin read" on addresses for select using (is_admin());

-- ── categories ───────────────────────────────────────────────
create policy "categories: public read"  on categories for select using (true);
create policy "categories: admin write"  on categories for insert with check (is_admin());
create policy "categories: admin update" on categories for update using (is_admin()) with check (is_admin());
create policy "categories: admin delete" on categories for delete using (is_admin());

-- ── brands ───────────────────────────────────────────────────
create policy "brands: public read"  on brands for select using (true);
create policy "brands: admin write"  on brands for insert with check (is_admin());
create policy "brands: admin update" on brands for update using (is_admin()) with check (is_admin());
create policy "brands: admin delete" on brands for delete using (is_admin());

-- ── products ─────────────────────────────────────────────────
create policy "products: public read active"  on products for select using (status = 'active' or is_admin());
create policy "products: admin write"         on products for insert with check (is_admin());
create policy "products: admin update"        on products for update using (is_admin()) with check (is_admin());
create policy "products: admin delete"        on products for delete using (is_admin());

-- ── product_images ───────────────────────────────────────────
create policy "product_images: public read"  on product_images for select using (true);
create policy "product_images: admin write"  on product_images for insert with check (is_admin());
create policy "product_images: admin update" on product_images for update using (is_admin()) with check (is_admin());
create policy "product_images: admin delete" on product_images for delete using (is_admin());

-- ── reviews ──────────────────────────────────────────────────
create policy "reviews: public read"    on reviews for select using (true);
create policy "reviews: own insert"     on reviews for insert with check (auth.uid() = user_id);
create policy "reviews: own update"     on reviews for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews: own delete"     on reviews for delete using (auth.uid() = user_id or is_admin());

-- ── wishlists ────────────────────────────────────────────────
create policy "wishlists: own user" on wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── cart_items ───────────────────────────────────────────────
create policy "cart_items: own user" on cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── orders ───────────────────────────────────────────────────
create policy "orders: own user"    on orders for select using (auth.uid() = user_id);
create policy "orders: own insert"  on orders for insert with check (auth.uid() = user_id);
create policy "orders: admin read"  on orders for select using (is_admin());
create policy "orders: admin update" on orders for update using (is_admin()) with check (is_admin());

-- ── order_items ──────────────────────────────────────────────
create policy "order_items: own user via order" on order_items for select
  using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "order_items: admin read" on order_items for select using (is_admin());
create policy "order_items: insert" on order_items for insert with check (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  or is_admin()
);

-- ── payments ─────────────────────────────────────────────────
create policy "payments: own user via order" on payments for select
  using (exists (select 1 from orders where orders.id = payments.order_id and orders.user_id = auth.uid()));
create policy "payments: admin read" on payments for select using (is_admin());
-- Payments inserted only by service role (webhook) so no user insert policy needed

-- ── newsletter_subscribers ───────────────────────────────────
create policy "newsletter: insert anyone"  on newsletter_subscribers for insert with check (true);
create policy "newsletter: admin read"     on newsletter_subscribers for select using (is_admin());
