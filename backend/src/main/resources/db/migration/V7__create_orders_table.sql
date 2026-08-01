CREATE TABLE orders (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status                      VARCHAR(20) NOT NULL,
    stripe_checkout_session_id  VARCHAR(255) NOT NULL,
    stripe_payment_intent_id    VARCHAR(255),
    subtotal                    NUMERIC(10,2) NOT NULL,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_orders_user_id ON orders (user_id);
CREATE UNIQUE INDEX ux_orders_stripe_checkout_session_id ON orders (stripe_checkout_session_id);
