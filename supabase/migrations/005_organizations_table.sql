-- Organizations table (beneficiary groups)
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Public can read active organizations (for checkout page)
CREATE POLICY "Public read organizations" ON organizations
  FOR SELECT USING (true);

-- Admin+ can insert
CREATE POLICY "Admin insert organizations" ON organizations
  FOR INSERT WITH CHECK (is_admin_writer());

-- Admin+ can update
CREATE POLICY "Admin update organizations" ON organizations
  FOR UPDATE USING (is_admin_writer());

-- Only super_admin can delete
CREATE POLICY "Super admin delete organizations" ON organizations
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM admin_users WHERE role = 'super_admin')
  );

-- Seed the 3 orgs
INSERT INTO organizations (name, slug, sort_order) VALUES
  ('Bower Hill Community Church', 'bower-hill', 1),
  ('Mt Lebanon Aqua Club (MLAC)', 'mlac', 2),
  ('Mt Lebanon Montessori', 'montessori', 3);
