-- Mt. Lebanon Flower Sale - Seed Data
-- 14 categories + 101 products from Dean's Greenhouse

-- Categories
INSERT INTO categories (id, name, slug, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Begonias', 'begonias', 1),
  ('c0000001-0000-0000-0000-000000000002', 'Impatiens', 'impatiens', 2),
  ('c0000001-0000-0000-0000-000000000003', 'Marigolds', 'marigolds', 3),
  ('c0000001-0000-0000-0000-000000000004', 'Petunias', 'petunias', 4),
  ('c0000001-0000-0000-0000-000000000005', 'Other Annual Flats', 'other-annual-flats', 5),
  ('c0000001-0000-0000-0000-000000000006', 'Vegetables & Herbs', 'vegetables-herbs', 6),
  ('c0000001-0000-0000-0000-000000000007', 'Fillers & Accents', 'fillers-accents', 7),
  ('c0000001-0000-0000-0000-000000000008', 'Wave Petunias', 'wave-petunias', 8),
  ('c0000001-0000-0000-0000-000000000009', 'Sunpatiens', 'sunpatiens', 9),
  ('c0000001-0000-0000-0000-000000000010', 'Sweet Potato Vines', 'sweet-potato-vines', 10),
  ('c0000001-0000-0000-0000-000000000011', 'Calibrachoa & Specialty', 'calibrachoa-specialty', 11),
  ('c0000001-0000-0000-0000-000000000012', 'Tuberous Begonias', 'tuberous-begonias', 12),
  ('c0000001-0000-0000-0000-000000000013', 'Geraniums', 'geraniums', 13),
  ('c0000001-0000-0000-0000-000000000014', 'Hanging Baskets', 'hanging-baskets', 14),
  ('c0000001-0000-0000-0000-000000000015', 'Supplies', 'supplies', 15),
  ('c0000001-0000-0000-0000-000000000016', 'Gift Certificates', 'gift-certificates', 16);

-- Begonias (Flats of 24 plants - $17.00)
INSERT INTO products (sku, name, slug, price_cents, category_id, unit_label, description, image_url, sort_order) VALUES
  ('BA1', 'Green Leaf Pink Begonia', 'ba1-green-leaf-pink-begonia', 1700, 'c0000001-0000-0000-0000-000000000001', 'flat of 24', 'Beautiful green leaf pink begonias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA1-500x500.jpg', 1),
  ('BA2', 'Green Leaf Scarlet Begonia', 'ba2-green-leaf-scarlet-begonia', 1700, 'c0000001-0000-0000-0000-000000000001', 'flat of 24', 'Vibrant green leaf scarlet begonias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA2-500x500.jpg', 2),
  ('BA3', 'Green Leaf White Begonia', 'ba3-green-leaf-white-begonia', 1700, 'c0000001-0000-0000-0000-000000000001', 'flat of 24', 'Elegant green leaf white begonias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA3-500x500.jpg', 3),
  ('BA4', 'Bronze Leaf Scarlet Begonia', 'ba4-bronze-leaf-scarlet-begonia', 1700, 'c0000001-0000-0000-0000-000000000001', 'flat of 24', 'Stunning bronze leaf scarlet begonias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA4-500x500.jpg', 4),
  ('BA5', 'Bronze Leaf White Begonia', 'ba5-bronze-leaf-white-begonia', 1700, 'c0000001-0000-0000-0000-000000000001', 'flat of 24', 'Lovely bronze leaf white begonias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA5-500x500.jpg', 5),
  ('BA6', 'Bronze Leaf Pink Scarlet Begonia', 'ba6-bronze-leaf-pink-scarlet-begonia', 1700, 'c0000001-0000-0000-0000-000000000001', 'flat of 24', 'Bronze leaf pink scarlet begonias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA6-500x500.jpg', 6),
  ('BA7', 'Bada Mix Begonia', 'ba7-bada-mix-begonia', 1700, 'c0000001-0000-0000-0000-000000000001', 'flat of 24', 'Colorful bada mix begonias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA7-500x500.jpg', 7),

-- Impatiens (Flats of 24 plants - $17.00)
  ('BA8', 'Lipstick Pink Impatiens', 'ba8-lipstick-pink-impatiens', 1700, 'c0000001-0000-0000-0000-000000000002', 'flat of 24', 'Bright lipstick pink impatiens in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA8-500x500.jpg', 1),
  ('BA9', 'Mixed Impatiens', 'ba9-mixed-impatiens', 1700, 'c0000001-0000-0000-0000-000000000002', 'flat of 24', 'Beautiful mixed color impatiens in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA9-500x500.jpg', 2),
  ('BA10', 'Red Impatiens', 'ba10-red-impatiens', 1700, 'c0000001-0000-0000-0000-000000000002', 'flat of 24', 'Classic red impatiens in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA10-500x500.jpg', 3),
  ('BA11', 'Salmon Impatiens', 'ba11-salmon-impatiens', 1700, 'c0000001-0000-0000-0000-000000000002', 'flat of 24', 'Warm salmon impatiens in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA11-500x500.jpg', 4),
  ('BA12', 'White Impatiens', 'ba12-white-impatiens', 1700, 'c0000001-0000-0000-0000-000000000002', 'flat of 24', 'Pure white impatiens in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA12-500x500.jpg', 5),

-- Marigolds (Flats of 24 plants - $17.00)
  ('BA13', 'Hot Pak Mix Marigold', 'ba13-hot-pak-mix-marigold', 1700, 'c0000001-0000-0000-0000-000000000003', 'flat of 24', 'Hot pak mix marigolds in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA13-500x500.jpg', 1),
  ('BA14', 'Hot Pak Orange Marigold', 'ba14-hot-pak-orange-marigold', 1700, 'c0000001-0000-0000-0000-000000000003', 'flat of 24', 'Bright orange hot pak marigolds in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA14-500x500.jpg', 2),
  ('BA15', 'Hot Pak Yellow Marigold', 'ba15-hot-pak-yellow-marigold', 1700, 'c0000001-0000-0000-0000-000000000003', 'flat of 24', 'Sunny yellow hot pak marigolds in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA15-500x500.jpg', 3),
  ('BA16', 'Inca Yellow 2 Marigold', 'ba16-inca-yellow-2-marigold', 1700, 'c0000001-0000-0000-0000-000000000003', 'flat of 24', 'Large inca yellow marigolds in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA16-500x500.jpg', 4),
  ('BA17', 'Inca Orange 2 Marigold', 'ba17-inca-orange-2-marigold', 1700, 'c0000001-0000-0000-0000-000000000003', 'flat of 24', 'Large inca orange marigolds in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA17-500x500.jpg', 5),

-- Petunias (Flats of 24 plants - $17.00)
  ('BA18', 'Sky Blue Petunia', 'ba18-sky-blue-petunia', 1700, 'c0000001-0000-0000-0000-000000000004', 'flat of 24', 'Sky blue petunias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA18-500x500.jpg', 1),
  ('BA19', 'Pink Petunia', 'ba19-pink-petunia', 1700, 'c0000001-0000-0000-0000-000000000004', 'flat of 24', 'Lovely pink petunias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA19-500x500.jpg', 2),
  ('BA20', 'Deep Purple Petunia', 'ba20-deep-purple-petunia', 1700, 'c0000001-0000-0000-0000-000000000004', 'flat of 24', 'Rich deep purple petunias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA20-500x500.jpg', 3),
  ('BA21', 'Single Mix Petunia', 'ba21-single-mix-petunia', 1700, 'c0000001-0000-0000-0000-000000000004', 'flat of 24', 'Mixed color petunias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA21-500x500.jpg', 4),
  ('BA22', 'Red Petunia', 'ba22-red-petunia', 1700, 'c0000001-0000-0000-0000-000000000004', 'flat of 24', 'Vibrant red petunias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA22-500x500.jpg', 5),
  ('BA23', 'White Petunia', 'ba23-white-petunia', 1700, 'c0000001-0000-0000-0000-000000000004', 'flat of 24', 'Clean white petunias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA23-500x500.jpg', 6),

-- Other Annual Flats (24 plants - $17.00)
  ('BA25', 'White Alyssum', 'ba25-white-alyssum', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Fragrant white alyssum in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA25-500x500.jpg', 1),
  ('BA26', 'Purple Alyssum', 'ba26-purple-alyssum', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Fragrant purple alyssum in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA26-500x500.jpg', 2),
  ('BA27', 'Mixed Coleus', 'ba27-mixed-coleus', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Colorful mixed coleus in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA27-500x500.jpg', 3),
  ('BA28', 'Mixed Dwarf Dahlia', 'ba28-mixed-dwarf-dahlia', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Mixed dwarf dahlias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA28-500x500.jpg', 4),
  ('BA29', 'Mixed Dianthus', 'ba29-mixed-dianthus', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Mixed dianthus in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA29-500x500.jpg', 5),
  ('BA30', 'Dusty Miller', 'ba30-dusty-miller', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Silver-leafed dusty miller in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA30-500x500.jpg', 6),
  ('BA31', 'Blue Lobelia', 'ba31-blue-lobelia', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Trailing blue lobelia in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA31-500x500.jpg', 7),
  ('BA32', 'Mixed Portulaca', 'ba32-mixed-portulaca', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Colorful mixed portulaca in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA32-500x500.jpg', 8),
  ('BA33', 'Blue Salvia', 'ba33-blue-salvia', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Blue salvia in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA33-500x500.jpg', 9),
  ('BA34', 'Dwarf Red Salvia', 'ba34-dwarf-red-salvia', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Compact dwarf red salvia in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA34-500x500.jpg', 10),
  ('BA35', 'Short Mixed Zinnias', 'ba35-short-mixed-zinnias', 1700, 'c0000001-0000-0000-0000-000000000005', 'flat of 24', 'Cheerful short mixed zinnias in a flat of 24 plants.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/BA35-500x500.jpg', 11),

-- Vegetables (3" pots - $2.00)
  ('P1', 'Green Bell Pepper', 'p1-green-bell-pepper', 200, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Green bell pepper in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/P1-500x500.jpg', 1),
  ('P2', 'Sweet Banana Pepper', 'p2-sweet-banana-pepper', 200, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Sweet banana pepper in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/P2-500x500.jpg', 2),
  ('P3', 'Jalapeno Pepper', 'p3-jalapeno-pepper', 200, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Jalapeno pepper in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/P3-500x500.jpg', 3),
  ('P4', 'Hungarian Hot Pepper', 'p4-hungarian-hot-pepper', 200, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Hungarian hot pepper in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/P4-500x500.jpg', 4),
  ('P6', 'Yellow Bell Pepper', 'p6-yellow-bell-pepper', 200, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Yellow bell pepper in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/P6-500x500.jpg', 5),
  ('T1', 'Big Boy Tomato', 't1-big-boy-tomato', 200, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Big Boy tomato in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/T1-500x500.jpg', 6),
  ('T2', 'Early Girl Tomato', 't2-early-girl-tomato', 200, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Early Girl tomato in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/T2-500x500.jpg', 7),
  ('T4', 'Sweet 100s Tomato', 't4-sweet-100s-tomato', 200, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Sweet 100s cherry tomato in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/T4-500x500.jpg', 8),
  ('T5', 'Beefsteak Tomato', 't5-beefsteak-tomato', 200, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Beefsteak tomato in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/T5-500x500.jpg', 9),
  ('H1', 'Basil', 'h1-basil', 400, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Fresh basil herb in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/H1-500x500.jpg', 10),
  ('H2', 'Parsley', 'h2-parsley', 400, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Fresh parsley herb in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/H2-500x500.jpg', 11),
  ('H3', 'Rosemary', 'h3-rosemary', 400, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Fragrant rosemary herb in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/H3-500x500.jpg', 12),
  ('H4', 'Oregano', 'h4-oregano', 400, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Fresh oregano herb in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/H4-500x500.jpg', 13),
  ('H5', 'Thyme', 'h5-thyme', 400, 'c0000001-0000-0000-0000-000000000006', '3" pot', 'Fresh thyme herb in a 3 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/H5-500x500.jpg', 14),

-- Fillers & Accents (3" pots - $3.00)
  ('A1', 'Spikes', 'a1-spikes', 300, 'c0000001-0000-0000-0000-000000000007', '3" pot', 'Dracaena spikes for container arrangements.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/A1-500x500.jpg', 1),
  ('A2', 'Vinca Vine', 'a2-vinca-vine', 300, 'c0000001-0000-0000-0000-000000000007', '3" pot', 'Trailing vinca vine for containers and borders.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/A2-500x500.jpg', 2),

-- Wave Petunias (4.5" pots - $5.00)
  ('48', 'Blue Wave Petunia', '48-blue-wave-petunia', 500, 'c0000001-0000-0000-0000-000000000008', '4.5" pot', 'Spreading blue wave petunia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/48-500x500.jpg', 1),
  ('49', 'Pink Cosmo Wave Petunia', '49-pink-cosmo-wave-petunia', 500, 'c0000001-0000-0000-0000-000000000008', '4.5" pot', 'Pink cosmo wave petunia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/49new2-500x500.jpg', 2),
  ('410', 'Sky Blue Wave Petunia', '410-sky-blue-wave-petunia', 500, 'c0000001-0000-0000-0000-000000000008', '4.5" pot', 'Sky blue wave petunia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/410new-500x500.jpg', 3),
  ('411', 'Red Wave Petunia', '411-red-wave-petunia', 500, 'c0000001-0000-0000-0000-000000000008', '4.5" pot', 'Red wave petunia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/411-500x500.jpg', 4),
  ('412', 'White Wave Petunia', '412-white-wave-petunia', 500, 'c0000001-0000-0000-0000-000000000008', '4.5" pot', 'White wave petunia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/412-500x500.jpg', 5),
  ('413', 'Yellow Wave Petunia', '413-yellow-wave-petunia', 500, 'c0000001-0000-0000-0000-000000000008', '4.5" pot', 'Yellow wave petunia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/413new-500x500.jpg', 6),

-- Sunpatiens (4.5" pots - $5.00)
  ('415', 'Orange Sunpatiens', '415-orange-sunpatiens', 500, 'c0000001-0000-0000-0000-000000000009', '4.5" pot', 'Vibrant orange sunpatiens in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/415-500x500.jpg', 1),
  ('416', 'Pink Sunpatiens', '416-pink-sunpatiens', 500, 'c0000001-0000-0000-0000-000000000009', '4.5" pot', 'Pink sunpatiens in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/416-500x500.jpg', 2),
  ('417', 'Purple Sunpatiens', '417-purple-sunpatiens', 500, 'c0000001-0000-0000-0000-000000000009', '4.5" pot', 'Purple sunpatiens in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/417-500x500.jpg', 3),
  ('418', 'Red Sunpatiens', '418-red-sunpatiens', 500, 'c0000001-0000-0000-0000-000000000009', '4.5" pot', 'Red sunpatiens in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/418-500x500.jpg', 4),
  ('419', 'Salmon Sunpatiens', '419-salmon-sunpatiens', 500, 'c0000001-0000-0000-0000-000000000009', '4.5" pot', 'Salmon sunpatiens in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/419-500x500.jpg', 5),
  ('420', 'White Sunpatiens', '420-white-sunpatiens', 500, 'c0000001-0000-0000-0000-000000000009', '4.5" pot', 'White sunpatiens in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/420-500x500.jpg', 6),

-- Sweet Potato Vines (4.5" pots - $5.00)
  ('422', 'Black Sweet Potato Vine', '422-black-sweet-potato-vine', 500, 'c0000001-0000-0000-0000-000000000010', '4.5" pot', 'Dramatic black sweet potato vine in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/422-500x500.jpg', 1),
  ('423', 'Yellow Sweet Potato Vine', '423-yellow-sweet-potato-vine', 500, 'c0000001-0000-0000-0000-000000000010', '4.5" pot', 'Bright yellow sweet potato vine in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/423-500x500.jpg', 2),

-- Calibrachoa & Specialty (4.5" pots - $5.00)
  ('432', 'Magic Pink Lemonade Superbells', '432-magic-pink-lemonade-superbells', 500, 'c0000001-0000-0000-0000-000000000011', '4.5" pot', 'Magic pink lemonade superbells calibrachoa.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/432new-500x500.jpg', 1),
  ('433', 'Dreamsicle Superbells', '433-dreamsicle-superbells', 500, 'c0000001-0000-0000-0000-000000000011', '4.5" pot', 'Dreamsicle superbells calibrachoa.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/433online-500x500.jpg', 2),
  ('434', 'Stained Glassworks Golden Gate Coleus', '434-stained-glassworks-golden-gate-coleus', 500, 'c0000001-0000-0000-0000-000000000011', '4.5" pot', 'Stunning golden gate coleus from the stained glassworks series.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/434online-500x500.jpg', 3),

-- Tuberous Begonias (4.5" pots - $5.00)
  ('425', 'Pink Tuberous Begonia', '425-pink-tuberous-begonia', 500, 'c0000001-0000-0000-0000-000000000012', '4.5" pot', 'Pink tuberous begonia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/425online-500x500.jpg', 1),
  ('426', 'Red Tuberous Begonia', '426-red-tuberous-begonia', 500, 'c0000001-0000-0000-0000-000000000012', '4.5" pot', 'Red tuberous begonia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/426-500x500.jpg', 2),
  ('427', 'Orange Tuberous Begonia', '427-orange-tuberous-begonia', 500, 'c0000001-0000-0000-0000-000000000012', '4.5" pot', 'Orange tuberous begonia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/427-500x500.jpg', 3),
  ('428', 'Yellow Tuberous Begonia', '428-yellow-tuberous-begonia', 500, 'c0000001-0000-0000-0000-000000000012', '4.5" pot', 'Yellow tuberous begonia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/428-500x500.jpg', 4),
  ('429', 'Salmon Tuberous Begonia', '429-salmon-tuberous-begonia', 500, 'c0000001-0000-0000-0000-000000000012', '4.5" pot', 'Salmon tuberous begonia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/429-500x500.jpg', 5),
  ('431', 'White Tuberous Begonia', '431-white-tuberous-begonia', 500, 'c0000001-0000-0000-0000-000000000012', '4.5" pot', 'White tuberous begonia in a 4.5 inch pot.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/431new-500x500.jpg', 6),

-- Geraniums (Tray of 8 - 4.5" pots - $33.00)
  ('G1', 'Candy Pink Geranium', 'g1-candy-pink-geranium', 3300, 'c0000001-0000-0000-0000-000000000013', 'tray of 8', 'Candy pink geraniums in a tray of 8 pots.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/G1-500x500.jpg', 1),
  ('G2', 'Light Salmon Geranium', 'g2-light-salmon-geranium', 3300, 'c0000001-0000-0000-0000-000000000013', 'tray of 8', 'Light salmon geraniums in a tray of 8 pots.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/G2-500x500.jpg', 2),
  ('G3', 'Magenta Geranium', 'g3-magenta-geranium', 3300, 'c0000001-0000-0000-0000-000000000013', 'tray of 8', 'Magenta geraniums in a tray of 8 pots.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/G3-500x500.jpg', 3),
  ('G4', 'Red Geranium', 'g4-red-geranium', 3300, 'c0000001-0000-0000-0000-000000000013', 'tray of 8', 'Classic red geraniums in a tray of 8 pots.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/G4-500x500.jpg', 4),
  ('G5', 'White Geranium', 'g5-white-geranium', 3300, 'c0000001-0000-0000-0000-000000000013', 'tray of 8', 'White geraniums in a tray of 8 pots.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/G5-500x500.jpg', 5),

-- Hanging Baskets (10")
  ('F1', 'Fern Hanging Basket', 'f1-fern-hanging-basket', 2500, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Lush fern in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/F1-500x500.jpg', 1),
  ('F2', 'Fuchsia Hanging Basket', 'f2-fuchsia-hanging-basket', 2200, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Beautiful fuchsia in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/F2-500x500.jpg', 2),
  ('HB2', 'Hummingbird Falls Basket', 'hb2-hummingbird-falls-basket', 2200, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Hummingbird Falls designer combo basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/HB2-500x500.jpg', 3),
  ('HB3', 'Dean''s Sunshiny Day Basket', 'hb3-deans-sunshiny-day-basket', 2200, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Dean''s Sunshiny Day designer combo basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/HB3-500x500.jpg', 4),
  ('HB4', 'Cherry Kiss Basket', 'hb4-cherry-kiss-basket', 2200, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Cherry Kiss designer combo basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/HB4-500x500.jpg', 5),
  ('HB5', 'Daisy Dance Basket', 'hb5-daisy-dance-basket', 2200, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Daisy Dance designer combo basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/HB5-500x500.jpg', 6),
  ('HB6', 'Pink Lemonade Basket', 'hb6-pink-lemonade-basket', 2200, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Pink Lemonade designer combo basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/HB6-500x500.jpg', 7),
  ('HB7', 'Night in Pompeii Basket', 'hb7-night-in-pompeii-basket', 2200, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Night in Pompeii designer combo basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/HB7-500x500.jpg', 8),
  ('HB10', 'Polar Peach Combo Basket', 'hb10-polar-peach-combo-basket', 2300, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Polar Peach combo designer basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/HB10-500x500.jpg', 9),
  ('HB13', 'Tropical Sorbet Basket', 'hb13-tropical-sorbet-basket', 2300, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Tropical Sorbet designer combo basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/HB13new-500x500.jpg', 10),
  ('HB14', 'Above & Beyond Basket', 'hb14-above-and-beyond-basket', 2300, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Above & Beyond designer combo basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/HB14new-500x500.jpg', 11),
  ('W1', 'Blue Wave Petunia Basket', 'w1-blue-wave-petunia-basket', 2000, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Blue wave petunia in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/W1-500x500.jpg', 12),
  ('W3', 'Red White & Blue Petunia Basket', 'w3-red-white-blue-petunia-basket', 2000, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Red, white & blue petunia in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/W3-500x500.jpg', 13),
  ('W7', 'Pink Cosmo Petunia Basket', 'w7-pink-cosmo-petunia-basket', 2000, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Pink cosmo petunia in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/W7-500x500.jpg', 14),
  ('W9', 'Pink Blue White Wave Basket', 'w9-pink-blue-white-wave-basket', 2000, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Pink, blue, white wave petunia in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/W9new-500x500.jpg', 15),
  ('SB1', 'Pink New Guinea Basket', 'sb1-pink-new-guinea-basket', 2000, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Pink New Guinea impatiens in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/SB1-500x500.jpg', 16),
  ('SB2', 'Purple New Guinea Basket', 'sb2-purple-new-guinea-basket', 2000, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Purple New Guinea impatiens in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/SB2-500x500.jpg', 17),
  ('SB3', 'Red New Guinea Basket', 'sb3-red-new-guinea-basket', 2000, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Red New Guinea impatiens in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/SB3-500x500.jpg', 18),
  ('SB4', 'Salmon New Guinea Basket', 'sb4-salmon-new-guinea-basket', 2000, 'c0000001-0000-0000-0000-000000000014', '10" basket', 'Salmon New Guinea impatiens in a 10 inch hanging basket.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/SB4-500x500.jpg', 19),

-- Supplies
  ('S1', 'Coast of Maine Potting Soil (8QT)', 's1-coast-of-maine-potting-soil', 800, 'c0000001-0000-0000-0000-000000000015', 'bag', 'Coast of Maine premium potting soil, 8 quart bag.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/S1-500x500.jpg', 1),

-- Gift Certificates
  ('GC1', '$10 Gift Card', 'gc1-10-gift-card', 1000, 'c0000001-0000-0000-0000-000000000016', 'each', '$10 gift card for Dean''s Greenhouse.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/GC1-500x500.jpg', 1),
  ('GC2', '$20 Gift Card', 'gc2-20-gift-card', 2000, 'c0000001-0000-0000-0000-000000000016', 'each', '$20 gift card for Dean''s Greenhouse.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/GC2-500x500.jpg', 2),
  ('GC3', '$50 Gift Card', 'gc3-50-gift-card', 5000, 'c0000001-0000-0000-0000-000000000016', 'each', '$50 gift card for Dean''s Greenhouse.', 'https://dg1.fundraiseit.org/image/cache/catalog/2024dg1/GC3-500x500.jpg', 3);
