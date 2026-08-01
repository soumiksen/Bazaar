package com.bazaar.backend.dto.checkout;

import java.util.UUID;

public record CheckoutSessionResponse(
        String checkoutUrl,
        UUID orderId
) {
}
