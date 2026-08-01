CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id      UUID REFERENCES products (id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    unit_price      NUMERIC(10,2) NOT NULL,
    quantity        INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_order_items_order_id ON order_items (order_id);
