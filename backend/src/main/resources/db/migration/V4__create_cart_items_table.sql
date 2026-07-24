CREATE TABLE cart_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    quantity        INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_cart_items_user_id ON cart_items (user_id);
CREATE UNIQUE INDEX ux_cart_items_user_product ON cart_items (user_id, product_id);
