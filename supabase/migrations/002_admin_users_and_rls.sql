-- Admin Users table
create type admin_role as enum ('super_admin', 'admin', 'volunteer');

create table admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default '',
  role admin_role not null default 'volunteer',
  created_at timestamptz default now()
);

create index idx_admin_users_user_id on admin_users(user_id);
create index idx_admin_users_email on admin_users(email);

-- Seed super admin
INSERT INTO admin_users (email, role, name) VALUES
  ('craig@craiggrella.com', 'super_admin', 'Craig Grella');

-- Enable RLS on admin_users
alter table admin_users enable row level security;

-- Admin users can read the admin_users table if they are in it
create policy "Authenticated users read admin_users" on admin_users
  for select using (
    auth.uid() in (select user_id from admin_users where user_id is not null)
  );

-- Super admins can do everything on admin_users
create policy "Super admin manage admin_users" on admin_users
  for all using (
    auth.uid() in (select user_id from admin_users where role = 'super_admin')
  );

-- Admins can insert into admin_users (add people) but not delete
create policy "Admin insert admin_users" on admin_users
  for insert with check (
    auth.uid() in (select user_id from admin_users where role in ('super_admin', 'admin'))
  );

-- Drop old RLS policies that used JWT claims (they don't work)
drop policy if exists "Admin all products" on products;
drop policy if exists "Admin all categories" on categories;
drop policy if exists "Admin read orders" on orders;
drop policy if exists "Admin update orders" on orders;
drop policy if exists "Admin insert orders" on orders;
drop policy if exists "Admin read order_items" on order_items;
drop policy if exists "Admin insert order_items" on order_items;

-- Helper function: check if user is any admin role
create or replace function is_admin_user()
returns boolean as $$
  select exists (
    select 1 from admin_users
    where user_id = auth.uid()
    and role in ('super_admin', 'admin', 'volunteer')
  );
$$ language sql security definer;

-- Helper function: check if user can write (admin or super_admin)
create or replace function is_admin_writer()
returns boolean as $$
  select exists (
    select 1 from admin_users
    where user_id = auth.uid()
    and role in ('super_admin', 'admin')
  );
$$ language sql security definer;

-- New RLS policies for products
create policy "Admin read products" on products
  for select using (true); -- public can read (already exists but just in case)

create policy "Admin write products" on products
  for insert with check (is_admin_writer());

create policy "Admin update products" on products
  for update using (is_admin_writer());

create policy "Admin delete products" on products
  for delete using (
    auth.uid() in (select user_id from admin_users where role = 'super_admin')
  );

-- New RLS policies for orders (all admin roles can read, admin+ can write)
create policy "Admin read orders" on orders
  for select using (is_admin_user());

create policy "Admin insert orders" on orders
  for insert with check (is_admin_writer());

create policy "Admin update orders" on orders
  for update using (is_admin_writer());

-- New RLS policies for order_items
create policy "Admin read order_items" on order_items
  for select using (is_admin_user());

create policy "Admin insert order_items" on order_items
  for insert with check (is_admin_writer());

-- New RLS policies for categories
create policy "Admin write categories" on categories
  for insert with check (is_admin_writer());

create policy "Admin update categories" on categories
  for update using (is_admin_writer());
