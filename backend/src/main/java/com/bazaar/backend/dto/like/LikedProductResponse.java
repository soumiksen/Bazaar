package com.bazaar.backend.dto.like;

import com.bazaar.backend.entity.LikedProduct;
import com.bazaar.backend.entity.Product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record LikedProductResponse(
        UUID id,
        UUID productId,
        String title,
        String category,
        BigDecimal price,
        String imageUrl,
        int stock,
        Instant createdAt
) {
    public static LikedProductResponse from(LikedProduct likedProduct) {
        Product product = likedProduct.getProduct();
        return new LikedProductResponse(
                likedProduct.getId(),
                product.getId(),
                product.getTitle(),
                product.getCategory(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStock(),
                likedProduct.getCreatedAt()
        );
    }
}
