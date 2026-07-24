package com.bazaar.backend.dto.cart;

import com.bazaar.backend.entity.CartItem;
import com.bazaar.backend.entity.Product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CartItemResponse(
        UUID id,
        UUID productId,
        String title,
        String category,
        BigDecimal price,
        String imageUrl,
        int stock,
        int quantity,
        Instant createdAt
) {
    public static CartItemResponse from(CartItem cartItem) {
        Product product = cartItem.getProduct();
        return new CartItemResponse(
                cartItem.getId(),
                product.getId(),
                product.getTitle(),
                product.getCategory(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStock(),
                cartItem.getQuantity(),
                cartItem.getCreatedAt()
        );
    }
}
