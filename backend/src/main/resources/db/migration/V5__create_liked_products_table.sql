CREATE TABLE liked_products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_liked_products_user_id ON liked_products (user_id);
CREATE UNIQUE INDEX ux_liked_products_user_product ON liked_products (user_id, product_id);
