package com.bazaar.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.checkout")
public record CheckoutProperties(
        String successUrl,
        String cancelUrl
) {
}
