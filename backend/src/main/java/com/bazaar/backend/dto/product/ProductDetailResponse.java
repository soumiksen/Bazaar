package com.bazaar.backend.dto.product;

import com.bazaar.backend.entity.Product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductDetailResponse(
        UUID id,
        String title,
        String category,
        BigDecimal price,
        int stock,
        String imageUrl,
        String description,
        String vendorName,
        Instant createdAt,
        double averageRating,
        int reviewCount
) {
    public static ProductDetailResponse from(Product product, Double averageRating, Long reviewCount) {
        return new ProductDetailResponse(
                product.getId(),
                product.getTitle(),
                product.getCategory(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getDescription(),
                product.getVendor().getName(),
                product.getCreatedAt(),
                averageRating == null ? 0.0 : averageRating,
                reviewCount == null ? 0 : reviewCount.intValue()
        );
    }
}
