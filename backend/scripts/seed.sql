-- Seed demo vendors and products. Idempotent: safe to re-run (skips rows that already exist).
-- All seeded vendors share the password: Password123!
-- Uses pgcrypto's bcrypt (cost 12), which is compatible with Spring's BCryptPasswordEncoder.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (name, email, password_hash, role)
SELECT v.name, v.email, crypt('Password123!', gen_salt('bf', 12)), 'VENDOR'
FROM (VALUES
    ('Northwind Electronics', 'northwind@bazaar.test'),
    ('Stride Footwear',       'stride@bazaar.test'),
    ('Haven & Co',            'haven@bazaar.test')
) AS v(name, email)
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE LOWER(u.email) = LOWER(v.email));

INSERT INTO products (vendor_id, title, category, price, stock, status, image_url, description)
SELECT u.id, p.title, p.category, p.price, p.stock, 'ACTIVE',
       'https://images.unsplash.com/photo-' || p.photo || '?w=800&auto=format&fit=crop&q=80',
       p.description
FROM (VALUES
    ('northwind@bazaar.test', 'Studio Over-Ear Headphones',  'Audio',       129.00, 40, '1505740420928-5e560c06d30e', 'Comfortable closed-back headphones with deep bass and 30-hour battery life.'),
    ('northwind@bazaar.test', 'Wired Foldable Headphones',   'Audio',        59.00, 75, '1583394838336-acd977736f90', 'Lightweight foldable headphones with an in-line mic and tangle-resistant cable.'),
    ('northwind@bazaar.test', 'Edge Smartphone 128GB',       'Electronics', 699.00, 25, '1511707171634-5f897ff02aa9', 'Bright edge-to-edge display, dual cameras and all-day battery.'),
    ('northwind@bazaar.test', 'UltraBook Pro 14"',           'Electronics',1299.00, 12, '1517336714731-489689fd1ca8', 'Thin-and-light 14-inch laptop with a backlit keyboard and fast SSD.'),
    ('northwind@bazaar.test', 'Workspace Laptop 15"',        'Electronics', 899.00, 18, '1593642632559-0c6d3fc62b89', 'A dependable 15-inch laptop for work and study.'),
    ('northwind@bazaar.test', 'Minimal Smartwatch',          'Wearables',   149.00, 60, '1523275335684-37898b6baf30', 'Clean white smartwatch with fitness and sleep tracking.'),
    ('stride@bazaar.test',    'AeroFlex Running Shoes',      'Footwear',    119.00, 50, '1542291026-7eec264c27ff',    'Breathable knit running shoes with a responsive cushioned sole.'),
    ('stride@bazaar.test',    'Night Runner Trainers',       'Footwear',     99.00, 45, '1491553895911-0055eca6402d', 'Lightweight black trainers built for daily mileage.'),
    ('stride@bazaar.test',    'Teal Suede Brogues',          'Footwear',    139.00, 20, '1560343090-f0409e92791a',    'Hand-finished suede brogues that dress up any outfit.'),
    ('stride@bazaar.test',    'Classic Aviator Sunglasses',  'Accessories',  89.00, 80, '1572635196237-14b3f281503f', 'Timeless black frames with UV400 protection.'),
    ('haven@bazaar.test',     'Chronograph Steel Watch',     'Wearables',   249.00, 15, '1523170335258-f5ed11844a49', 'Stainless steel chronograph with a water-resistant case.'),
    ('haven@bazaar.test',     'Coral Leather Handbag',       'Accessories', 189.00, 22, '1584917865442-de89df76afd3', 'Structured top-handle handbag in polished coral leather.'),
    ('haven@bazaar.test',     'Noir Eau de Parfum 50ml',     'Beauty',       95.00, 35, '1585386959984-a4155224a1ad', 'A deep, elegant fragrance with notes of amber and vanilla.'),
    ('haven@bazaar.test',     'Scandi Wooden Stool',         'Home',         49.00, 30, '1503602642458-232111445657', 'Light solid-wood stool that works as a seat or side table.'),
    ('haven@bazaar.test',     'Desk Setup Laptop Stand Kit', 'Home',         79.00, 28, '1496181133206-80ce9b88a853', 'A tidy desk kit to elevate your laptop and keep your workspace clean.')
) AS p(vendor_email, title, category, price, stock, photo, description)
JOIN users u ON LOWER(u.email) = LOWER(p.vendor_email)
WHERE NOT EXISTS (SELECT 1 FROM products x WHERE x.vendor_id = u.id AND x.title = p.title);

-- ---- Extra vendors and products (batch 2) ----
INSERT INTO users (name, email, password_hash, role)
SELECT v.name, v.email, crypt('Password123!', gen_salt('bf', 12)), 'VENDOR'
FROM (VALUES
    ('Urban Thread', 'urbanthread@bazaar.test'),
    ('Lumen Home', 'lumen@bazaar.test'),
    ('Glow Beauty', 'glow@bazaar.test'),
    ('Peak Fitness', 'peak@bazaar.test')
) AS v(name, email)
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE LOWER(u.email) = LOWER(v.email));
INSERT INTO products (vendor_id, title, category, price, stock, status, image_url, description)
SELECT u.id, p.title, p.category, p.price, p.stock, 'ACTIVE',
       'https://images.unsplash.com/photo-' || p.photo || '?w=800&auto=format&fit=crop&q=80',
       p.description
FROM (VALUES
    ('urbanthread@bazaar.test', 'Cream Knit Fringe Top', 'Apparel', 58.00, 30, '1434389677669-e08b4cac3105', 'Soft hand-knit top with a relaxed fringe hem.'),
    ('urbanthread@bazaar.test', 'Everyday Cotton Tee Pack', 'Apparel', 45.00, 120, '1489987707025-afc232f7ea0f', 'A pack of breathable cotton tees in seasonal colours.'),
    ('urbanthread@bazaar.test', 'Classic White Crew Tee', 'Apparel', 24.00, 150, '1521572163474-6864f9cf17ab', 'Heavyweight cotton tee with a clean, boxy fit.'),
    ('urbanthread@bazaar.test', 'Sage Green Henley Tee', 'Apparel', 29.00, 90, '1523381210434-271e8be1f52b', 'Garment-washed tee in a muted sage tone.'),
    ('urbanthread@bazaar.test', 'Graphic Print Tee', 'Apparel', 32.00, 70, '1576566588028-4147f3842f27', 'Screen-printed graphic tee in soft organic cotton.'),
    ('urbanthread@bazaar.test', 'Black Minimal Tee', 'Apparel', 26.00, 110, '1583743814966-8936f5b7be1a', 'Staple black tee with a subtle chest print.'),
    ('urbanthread@bazaar.test', 'Sunny Yellow Tracksuit', 'Apparel', 110.00, 25, '1515886657613-9f3515b0c78f', 'Matching cropped hoodie and joggers in bold yellow.'),
    ('urbanthread@bazaar.test', 'Grey Pullover Hoodie', 'Apparel', 64.00, 60, '1556821840-3a63f95609a7', 'Cosy brushed-fleece hoodie with a roomy hood.'),
    ('urbanthread@bazaar.test', 'Classic White Sweatshirt', 'Apparel', 52.00, 55, '1620799140408-edc6dcb6d633', 'Midweight crewneck sweatshirt that goes with everything.'),
    ('urbanthread@bazaar.test', 'Selvedge Denim Jeans', 'Apparel', 98.00, 40, '1542272604-787c3835535d', 'Straight-fit jeans in durable, broken-in denim.'),
    ('urbanthread@bazaar.test', 'Camel Belted Trench Coat', 'Apparel', 210.00, 14, '1539533018447-63fcce2678e3', 'Timeless belted trench in a warm camel tone.'),
    ('urbanthread@bazaar.test', 'Black Leather Biker Jacket', 'Apparel', 275.00, 10, '1551028719-00167b16eac5', 'Supple leather jacket with a classic biker cut.'),
    ('urbanthread@bazaar.test', 'Rust Bomber Jacket', 'Apparel', 120.00, 28, '1591047139829-d91aecb6caea', 'Lightweight zip-up bomber in warm rust.'),
    ('stride@bazaar.test', 'Cloud Walker Sneakers', 'Footwear', 110.00, 60, '1460353581641-37baddab0fa2', 'Light, cushioned sneakers for city streets.'),
    ('stride@bazaar.test', 'Tan Court Sneakers', 'Footwear', 105.00, 40, '1549298916-b41d501d3772', 'Low-top leather sneakers with a warm tan finish.'),
    ('stride@bazaar.test', 'Burgundy Skate Shoes', 'Footwear', 75.00, 55, '1525966222134-fcfa99b8ae77', 'Durable canvas skate shoes with a vulcanised sole.'),
    ('stride@bazaar.test', 'High-Top Street Sneakers', 'Footwear', 125.00, 35, '1556906781-9a412961c28c', 'Retro high-tops in a bold colour-block design.'),
    ('stride@bazaar.test', 'Pastel Pop Sneakers', 'Footwear', 95.00, 45, '1595950653106-6c9ebd614d3a', 'Playful pastel sneakers with a chunky sole.'),
    ('haven@bazaar.test', 'Navy Commuter Messenger Bag', 'Accessories', 85.00, 32, '1553062407-98eeb64c6a62', 'Water-resistant messenger bag with a padded laptop sleeve.'),
    ('haven@bazaar.test', 'Trail Canvas Backpack', 'Accessories', 92.00, 38, '1491637639811-60e2756cc1c7', 'Rugged canvas backpack with leather straps.'),
    ('haven@bazaar.test', 'Quilted Chain Crossbody', 'Accessories', 160.00, 18, '1548036328-c9fa89d128fa', 'Quilted leather crossbody with a gold chain strap.'),
    ('haven@bazaar.test', 'Wicker Top-Handle Bag', 'Accessories', 130.00, 20, '1590874103328-eac38a683ce7', 'Handwoven wicker bag with a leather handle.'),
    ('haven@bazaar.test', 'Brown Leather Bifold Wallet', 'Accessories', 55.00, 70, '1627123424574-724758594e93', 'Full-grain leather wallet that ages beautifully.'),
    ('haven@bazaar.test', 'Rose Gold Quartz Watch', 'Wearables', 175.00, 24, '1522312346375-d1a52e2b99b3', 'Rose gold quartz watch with a fine mesh band.'),
    ('haven@bazaar.test', 'Minimalist Leather Watch', 'Wearables', 135.00, 30, '1524592094714-0f0654e20314', 'Slim white-dial watch on a tan leather strap.'),
    ('northwind@bazaar.test', 'Fitness Smartwatch', 'Wearables', 199.00, 45, '1544117519-31a4b719223d', 'GPS smartwatch with heart-rate and workout tracking.'),
    ('northwind@bazaar.test', 'Always-On Smartwatch', 'Wearables', 229.00, 30, '1546868871-7041f2a55e12', 'Bright always-on display with a week of battery life.'),
    ('northwind@bazaar.test', 'Noise-Cancelling Headphones', 'Audio', 249.00, 28, '1546435770-a3e426bf472b', 'Over-ear headphones with active noise cancellation.'),
    ('northwind@bazaar.test', 'True Wireless Earbuds Pro', 'Audio', 159.00, 65, '1572569511254-d8f925fe2cbb', 'Wireless earbuds with a charging case and clear calls.'),
    ('northwind@bazaar.test', 'Sport Wireless Earbuds', 'Audio', 79.00, 85, '1590658268037-6bf12165a8df', 'Sweat-resistant earbuds with a secure fit.'),
    ('northwind@bazaar.test', 'Portable Bluetooth Speaker', 'Audio', 89.00, 60, '1608043152269-423dbba4e7e1', 'Rugged, waterproof speaker with 12 hours of playtime.'),
    ('northwind@bazaar.test', 'Walnut Bookshelf Speakers', 'Audio', 179.00, 16, '1545454675-3531b543be5d', 'Warm-sounding wooden bookshelf speakers.'),
    ('northwind@bazaar.test', 'Smart Home Speaker Set', 'Audio', 139.00, 34, '1558089687-f282ffcbc126', 'Voice-controlled speaker and smart lock bundle.'),
    ('northwind@bazaar.test', 'Pro Tablet 11"', 'Electronics', 649.00, 20, '1544244015-0df4b3ffc6b0', '11-inch tablet with a stylus and vivid display.'),
    ('northwind@bazaar.test', 'Wireless Mouse', 'Electronics', 29.00, 150, '1527864550417-7fd91fc51a46', 'Ergonomic wireless mouse with a long battery life.'),
    ('northwind@bazaar.test', 'Slim Wireless Keyboard', 'Electronics', 69.00, 80, '1541140532154-b024d705b90a', 'Low-profile white keyboard for a clean desk.'),
    ('northwind@bazaar.test', 'Compact Keyboard', 'Electronics', 79.00, 65, '1587829741301-dc798b83add3', 'Compact aluminium keyboard with quiet keys.'),
    ('northwind@bazaar.test', 'All-in-One Desktop 24"', 'Electronics', 1099.00, 9, '1527443224154-c4a3942d3acf', 'Sleek 24-inch all-in-one with a razor-thin bezel.'),
    ('northwind@bazaar.test', 'Gaming Desktop Tower', 'Electronics', 1599.00, 7, '1593640408182-31c70c8268f5', 'High-performance tower with RGB lighting.'),
    ('northwind@bazaar.test', 'Pro DSLR Camera', 'Cameras', 749.00, 12, '1502920917128-1aa500764cbd', 'DSLR with a versatile kit lens for stills and video.'),
    ('northwind@bazaar.test', 'Mirrorless Camera Kit', 'Cameras', 999.00, 10, '1516035069371-29a1b244cc32', 'Compact mirrorless camera with extra lenses.'),
    ('northwind@bazaar.test', 'Instant Film Camera', 'Cameras', 119.00, 36, '1526170375885-4d8ecf77b99f', 'Retro instant camera that prints on the spot.'),
    ('lumen@bazaar.test', 'Emerald Velvet Sofa', 'Home', 799.00, 6, '1555041469-a586c61ea9bc', 'Mid-century two-seater sofa in rich emerald velvet.'),
    ('lumen@bazaar.test', 'Mustard Accent Armchair', 'Home', 349.00, 11, '1586023492125-27b2c045efd7', 'Comfortable armchair that adds a pop of colour.'),
    ('lumen@bazaar.test', 'Modern Shell Chair & Side Table', 'Home', 189.00, 17, '1517705008128-361805f42e86', 'Moulded white chair with a brass side table.'),
    ('lumen@bazaar.test', 'Matte Black Desk Lamp', 'Home', 59.00, 48, '1507473885765-e6ed057f782c', 'Adjustable desk lamp with a warm, focused glow.'),
    ('lumen@bazaar.test', 'Living Room Starter Set', 'Home', 520.00, 8, '1513694203232-719a280e022f', 'Sofa, dresser and lamp styled for a small living room.'),
    ('lumen@bazaar.test', 'Ceramic Storage Jar', 'Home', 34.00, 60, '1602143407151-7111542de6e8', 'Matte green ceramic jar with a snug lid.'),
    ('lumen@bazaar.test', 'Classic White Mug', 'Kitchen', 14.00, 200, '1514228742587-6b1558fcca3d', 'Sturdy stoneware mug for coffee or tea.'),
    ('lumen@bazaar.test', 'Cappuccino Cup & Saucer', 'Kitchen', 22.00, 90, '1517256064527-09c73fc73e38', 'Wide porcelain cup and saucer for the perfect cappuccino.'),
    ('lumen@bazaar.test', 'Reusable Water Bottle', 'Kitchen', 18.00, 140, '1523362628745-0c100150b504', 'BPA-free bottle that fits any cup holder.'),
    ('lumen@bazaar.test', 'Barista Coffee Duo Set', 'Kitchen', 39.00, 50, '1495474472287-4d71bcdd2085', 'Double-walled cups for latte art at home.'),
    ('glow@bazaar.test', 'Eau de Parfum Classic 100ml', 'Beauty', 120.00, 30, '1541643600914-78b084683601', 'Timeless floral aldehyde fragrance in a glass bottle.'),
    ('glow@bazaar.test', 'Vintage Gold Eau de Toilette', 'Beauty', 88.00, 26, '1563170351-be82bc888aa4', 'Fresh, green fragrance in a vintage-style bottle.'),
    ('glow@bazaar.test', 'Noir Parfum Intense 50ml', 'Beauty', 110.00, 22, '1594035910387-fea47794261f', 'Intense, dark fragrance with a floral heart.'),
    ('glow@bazaar.test', 'Hydrating Face Cream Tube', 'Beauty', 36.00, 75, '1556228720-195a672e8a03', 'Lightweight daily moisturiser for all skin types.'),
    ('glow@bazaar.test', 'Natural Skincare Gift Set', 'Beauty', 68.00, 40, '1612817288484-6f916006741a', 'Botanical oils and balms in a giftable set.'),
    ('glow@bazaar.test', 'Eyeshadow & Face Palette', 'Beauty', 54.00, 55, '1522335789203-aabd1fc54bc9', 'Neutral eyeshadow and bronzer palette.'),
    ('glow@bazaar.test', 'Rose Gold Brush Set', 'Beauty', 42.00, 65, '1596462502278-27bfdc403348', 'Soft makeup brushes plus a hair scrunchie.'),
    ('peak@bazaar.test', 'Olympic Barbell', 'Fitness', 189.00, 15, '1517836357463-d25dfeac3438', 'Knurled steel barbell for serious lifting.'),
    ('peak@bazaar.test', 'Dumbbell Rack Set', 'Fitness', 420.00, 6, '1534438327276-14e5300c3a48', 'Rubber hex dumbbells from 5 to 50 lb with a rack.'),
    ('peak@bazaar.test', 'Non-Slip Yoga Mat', 'Fitness', 45.00, 100, '1544367567-0f2fcb009e0b', 'Cushioned, non-slip mat for yoga and stretching.'),
    ('peak@bazaar.test', 'Core Workout Mat', 'Fitness', 39.00, 90, '1571019613454-1cb2f99b2d8b', 'Extra-thick mat for core and floor exercises.')
) AS p(vendor_email, title, category, price, stock, photo, description)
JOIN users u ON LOWER(u.email) = LOWER(p.vendor_email)
WHERE NOT EXISTS (SELECT 1 FROM products x WHERE x.vendor_id = u.id AND x.title = p.title);

-- ---- Merchandising data (requires migration V9) ----
-- Spread creation dates over the last 90 days so "New" badges and the New Arrivals tab are meaningful.
UPDATE products p SET created_at = now() - make_interval(days => abs(hashtext(p.title)) % 90)
FROM users u WHERE u.id = p.vendor_id AND u.email LIKE '%@bazaar.test';

-- Put roughly a quarter of the seeded products on sale (15-33% off) by setting an original price.
UPDATE products p SET compare_at_price = ceil(p.price * (1.18 + (abs(hashtext(p.title)) % 16) / 100.0))
FROM users u WHERE u.id = p.vendor_id AND u.email LIKE '%@bazaar.test'
  AND abs(hashtext(p.title)) % 4 = 0;

-- Mark most seeded vendors as verified (Glow Beauty stays unverified so both states are visible).
UPDATE users SET verified = TRUE WHERE email LIKE '%@bazaar.test' AND email <> 'glow@bazaar.test';
