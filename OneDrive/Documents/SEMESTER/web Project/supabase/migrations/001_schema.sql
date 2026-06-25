-- ============================================================
-- TechGadget Store — Full Schema
-- Run this in Supabase Dashboard → SQL Editor (or supabase db push)
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Custom types ─────────────────────────────────────────────
create type user_role        as enum ('customer', 'admin');
create type product_status   as enum ('active', 'draft', 'archived');
create type order_status     as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
create type payment_status   as enum ('pending', 'paid', 'failed', 'refunded');

-- ── profiles ─────────────────────────────────────────────────
-- Mirrors auth.users; created automatically on signup via trigger.
create table profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  full_name    text,
  email        text        not null,
  phone        text,
  role         user_role   not null default 'customer',
  avatar_url   text,
  is_disabled  boolean     not null default false,
  created_at   timestamptz not null default now()
);

-- ── addresses ────────────────────────────────────────────────
create table addresses (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references profiles(id) on delete cascade,
  label        text        not null default 'Home',
  full_name    text        not null,
  phone        text        not null,
  line1        text        not null,
  line2        text,
  city         text        not null,
  state        text        not null,
  postal_code  text        not null,
  country      text        not null default 'US',
  is_default   boolean     not null default false,
  created_at   timestamptz not null default now()
);

-- ── categories ───────────────────────────────────────────────
create table categories (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  slug         text        not null unique,
  description  text,
  image_url    text,
  created_at   timestamptz not null default now()
);

-- ── brands ───────────────────────────────────────────────────
create table brands (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  slug         text        not null unique,
  logo_url     text,
  created_at   timestamptz not null default now()
);

-- ── products ─────────────────────────────────────────────────
create table products (
  id               uuid           primary key default gen_random_uuid(),
  name             text           not null,
  slug             text           not null unique,
  description      text           not null default '',
  specs            jsonb          not null default '{}',
  price            numeric(10,2)  not null check (price >= 0),
  compare_at_price numeric(10,2)  check (compare_at_price >= 0),
  category_id      uuid           references categories(id) on delete set null,
  brand_id         uuid           references brands(id) on delete set null,
  stock_quantity   integer        not null default 0 check (stock_quantity >= 0),
  sku              text           not null unique,
  is_featured      boolean        not null default false,
  is_new_arrival   boolean        not null default false,
  rating_avg       numeric(3,2)   not null default 0,
  rating_count     integer        not null default 0,
  status           product_status not null default 'draft',
  created_at       timestamptz    not null default now(),
  updated_at       timestamptz    not null default now()
);

create index idx_products_category   on products(category_id);
create index idx_products_brand      on products(brand_id);
create index idx_products_status     on products(status);
create index idx_products_featured   on products(is_featured) where is_featured = true;
create index idx_products_new        on products(is_new_arrival) where is_new_arrival = true;

-- ── product_images ───────────────────────────────────────────
create table product_images (
  id          uuid    primary key default gen_random_uuid(),
  product_id  uuid    not null references products(id) on delete cascade,
  url         text    not null,
  alt         text,
  position    integer not null default 0
);

create index idx_product_images_product on product_images(product_id, position);

-- ── reviews ──────────────────────────────────────────────────
create table reviews (
  id          uuid        primary key default gen_random_uuid(),
  product_id  uuid        not null references products(id) on delete cascade,
  user_id     uuid        not null references profiles(id) on delete cascade,
  rating      smallint    not null check (rating between 1 and 5),
  title       text,
  comment     text,
  created_at  timestamptz not null default now(),
  unique(product_id, user_id)
);

create index idx_reviews_product on reviews(product_id);

-- ── wishlists ────────────────────────────────────────────────
create table wishlists (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references profiles(id) on delete cascade,
  product_id  uuid        not null references products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_id, product_id)
);

create index idx_wishlists_user on wishlists(user_id);

-- ── cart_items ───────────────────────────────────────────────
create table cart_items (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references profiles(id) on delete cascade,
  product_id  uuid        not null references products(id) on delete cascade,
  quantity    integer     not null default 1 check (quantity > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id, product_id)
);

create index idx_cart_user on cart_items(user_id);

-- ── orders ───────────────────────────────────────────────────
create table orders (
  id                uuid           primary key default gen_random_uuid(),
  user_id           uuid           not null references profiles(id) on delete restrict,
  order_number      text           not null unique,
  status            order_status   not null default 'pending',
  subtotal          numeric(10,2)  not null,
  shipping_fee      numeric(10,2)  not null default 0,
  tax               numeric(10,2)  not null default 0,
  total             numeric(10,2)  not null,
  currency          text           not null default 'USD',
  shipping_address  jsonb          not null,
  payment_status    payment_status not null default 'pending',
  payment_provider  text,
  payment_intent_id text,
  created_at        timestamptz    not null default now(),
  updated_at        timestamptz    not null default now()
);

create index idx_orders_user    on orders(user_id);
create index idx_orders_number  on orders(order_number);
create index idx_orders_status  on orders(status);
create index idx_orders_payment on orders(payment_intent_id) where payment_intent_id is not null;

-- ── order_items ──────────────────────────────────────────────
create table order_items (
  id            uuid          primary key default gen_random_uuid(),
  order_id      uuid          not null references orders(id) on delete cascade,
  product_id    uuid          references products(id) on delete set null,
  product_name  text          not null,
  unit_price    numeric(10,2) not null,
  quantity      integer       not null check (quantity > 0),
  subtotal      numeric(10,2) not null
);

create index idx_order_items_order on order_items(order_id);

-- ── payments ─────────────────────────────────────────────────
create table payments (
  id                  uuid          primary key default gen_random_uuid(),
  order_id            uuid          not null references orders(id) on delete restrict,
  provider            text          not null,
  provider_payment_id text          not null,
  amount              numeric(10,2) not null,
  currency            text          not null default 'USD',
  status              text          not null,
  raw_response        jsonb,
  created_at          timestamptz   not null default now()
);

create index idx_payments_order on payments(order_id);

-- ── newsletter_subscribers ───────────────────────────────────
create table newsletter_subscribers (
  id             uuid        primary key default gen_random_uuid(),
  email          text        not null unique,
  subscribed_at  timestamptz not null default now()
);

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-create profile row when a user signs up via Supabase Auth
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Auto-update products.updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on products
  for each row execute procedure set_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute procedure set_updated_at();

create trigger cart_updated_at
  before update on cart_items
  for each row execute procedure set_updated_at();

-- Auto-recalculate product rating when a review is added/updated/deleted
create or replace function recalc_product_rating()
returns trigger language plpgsql as $$
declare
  target_product_id uuid;
begin
  target_product_id := coalesce(new.product_id, old.product_id);
  update products
  set
    rating_avg   = (select coalesce(avg(rating), 0) from reviews where product_id = target_product_id),
    rating_count = (select count(*)                  from reviews where product_id = target_product_id)
  where id = target_product_id;
  return coalesce(new, old);
end;
$$;

create trigger reviews_rating_change
  after insert or update or delete on reviews
  for each row execute procedure recalc_product_rating();

-- Ensure only one default address per user
create or replace function enforce_single_default_address()
returns trigger language plpgsql as $$
begin
  if new.is_default then
    update addresses
    set is_default = false
    where user_id = new.user_id and id <> new.id;
  end if;
  return new;
end;
$$;

create trigger single_default_address
  after insert or update on addresses
  for each row when (new.is_default = true)
  execute procedure enforce_single_default_address();
