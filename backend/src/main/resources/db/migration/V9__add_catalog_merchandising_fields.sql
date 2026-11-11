-- Original ("compare at") price lets a product show a discount badge and strikethrough price.
ALTER TABLE products ADD COLUMN compare_at_price NUMERIC(10,2);
ALTER TABLE products ADD CONSTRAINT ck_products_compare_at_price CHECK (compare_at_price IS NULL OR compare_at_price > price);

-- Vendors can be marked verified (shown as a "Verified" badge on storefront cards).
ALTER TABLE users ADD COLUMN verified BOOLEAN NOT NULL DEFAULT FALSE;
