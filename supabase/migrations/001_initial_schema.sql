-- Mt. Lebanon Flower Sale - Database Schema

create type order_status as enum ('pending', 'paid', 'fulfilled', 'cancelled');
create type payment_method as enum ('online_card', 'in_person_card', 'cash', 'check');
create type order_source as enum ('online', 'in_person');

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order int default 0
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  slug text unique not null,
  description text,
  price_cents int not null,
  category_id uuid references categories(id),
  image_url text,
  unit_label text default 'each',
  in_stock boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number serial,
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text,
  status order_status default 'pending',
  subtotal_cents int not null,
  stripe_session_id text unique,
  stripe_payment_intent text,
  payment_method payment_method default 'online_card',
  source order_source default 'online',
  check_number text,
  notes text,
  created_at timestamptz default now()
);

-- Order Items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  sku text not null,
  product_name text not null,
  price_cents int not null,
  quantity int not null
);

-- Indexes
create index idx_products_category on products(category_id);
create index idx_products_sku on products(sku);
create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at);
create index idx_order_items_order on order_items(order_id);

-- Row Level Security
alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public can read products and categories
create policy "Public read products" on products for select using (true);
create policy "Public read categories" on categories for select using (true);

-- Authenticated users with admin role can do everything
create policy "Admin all products" on products for all using (
  (select auth.jwt() ->> 'user_role') = 'admin'
);
create policy "Admin all categories" on categories for all using (
  (select auth.jwt() ->> 'user_role') = 'admin'
);
create policy "Admin read orders" on orders for select using (
  (select auth.jwt() ->> 'user_role') = 'admin'
);
create policy "Admin update orders" on orders for update using (
  (select auth.jwt() ->> 'user_role') = 'admin'
);
create policy "Admin insert orders" on orders for insert with check (
  (select auth.jwt() ->> 'user_role') = 'admin'
);
create policy "Admin read order_items" on order_items for select using (
  (select auth.jwt() ->> 'user_role') = 'admin'
);
create policy "Admin insert order_items" on order_items for insert with check (
  (select auth.jwt() ->> 'user_role') = 'admin'
);
