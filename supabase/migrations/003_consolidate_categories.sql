-- Consolidate 16 categories into 8 cleaner groups

-- Create new categories
INSERT INTO categories (id, name, slug, sort_order) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'Annuals', 'annuals', 1),
  ('d0000001-0000-0000-0000-000000000002', 'Geraniums', 'geraniums-new', 2),
  ('d0000001-0000-0000-0000-000000000003', 'Hanging Baskets', 'hanging-baskets-new', 3),
  ('d0000001-0000-0000-0000-000000000004', 'Vegetables', 'vegetables', 4),
  ('d0000001-0000-0000-0000-000000000005', 'Herbs', 'herbs', 5),
  ('d0000001-0000-0000-0000-000000000006', 'Specialty Plants', 'specialty-plants', 6),
  ('d0000001-0000-0000-0000-000000000007', 'Supplies', 'supplies-new', 7),
  ('d0000001-0000-0000-0000-000000000008', 'Gift Cards', 'gift-cards', 8);

-- Remap products: Annuals (begonias, impatiens, marigolds, petunias, other annual flats, fillers)
UPDATE products SET category_id = 'd0000001-0000-0000-0000-000000000001'
WHERE category_id IN (
  'c0000001-0000-0000-0000-000000000001', -- Begonias
  'c0000001-0000-0000-0000-000000000002', -- Impatiens
  'c0000001-0000-0000-0000-000000000003', -- Marigolds
  'c0000001-0000-0000-0000-000000000004', -- Petunias
  'c0000001-0000-0000-0000-000000000005', -- Other Annual Flats
  'c0000001-0000-0000-0000-000000000007'  -- Fillers & Accents
);

-- Remap: Geraniums
UPDATE products SET category_id = 'd0000001-0000-0000-0000-000000000002'
WHERE category_id = 'c0000001-0000-0000-0000-000000000013';

-- Remap: Hanging Baskets
UPDATE products SET category_id = 'd0000001-0000-0000-0000-000000000003'
WHERE category_id = 'c0000001-0000-0000-0000-000000000014';

-- Remap: Vegetables (peppers + tomatoes)
UPDATE products SET category_id = 'd0000001-0000-0000-0000-000000000004'
WHERE category_id = 'c0000001-0000-0000-0000-000000000006'
AND sku LIKE 'P%' OR sku LIKE 'T%';

-- Remap: Herbs
UPDATE products SET category_id = 'd0000001-0000-0000-0000-000000000005'
WHERE sku LIKE 'H%' AND sku != 'HB2' AND sku != 'HB3' AND sku != 'HB4' AND sku != 'HB5' AND sku != 'HB6' AND sku != 'HB7' AND sku != 'HB10' AND sku != 'HB13' AND sku != 'HB14';

-- Remap: Specialty Plants (wave petunias, sunpatiens, sweet potato vines, calibrachoa, tuberous begonias)
UPDATE products SET category_id = 'd0000001-0000-0000-0000-000000000006'
WHERE category_id IN (
  'c0000001-0000-0000-0000-000000000008', -- Wave Petunias
  'c0000001-0000-0000-0000-000000000009', -- Sunpatiens
  'c0000001-0000-0000-0000-000000000010', -- Sweet Potato Vines
  'c0000001-0000-0000-0000-000000000011', -- Calibrachoa & Specialty
  'c0000001-0000-0000-0000-000000000012'  -- Tuberous Begonias
);

-- Remap: Supplies
UPDATE products SET category_id = 'd0000001-0000-0000-0000-000000000007'
WHERE category_id = 'c0000001-0000-0000-0000-000000000015';

-- Remap: Gift Cards
UPDATE products SET category_id = 'd0000001-0000-0000-0000-000000000008'
WHERE category_id = 'c0000001-0000-0000-0000-000000000016';

-- Delete old categories (products have been remapped)
DELETE FROM categories WHERE id LIKE 'c0000001%';

-- Rename new categories to clean slugs
UPDATE categories SET slug = 'geraniums' WHERE id = 'd0000001-0000-0000-0000-000000000002';
UPDATE categories SET slug = 'hanging-baskets' WHERE id = 'd0000001-0000-0000-0000-000000000003';
UPDATE categories SET slug = 'supplies' WHERE id = 'd0000001-0000-0000-0000-000000000007';
