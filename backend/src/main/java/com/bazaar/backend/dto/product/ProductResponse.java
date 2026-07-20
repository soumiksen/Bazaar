package com.bazaar.backend.dto.product;

import com.bazaar.backend.entity.Product;
import com.bazaar.backend.entity.ProductStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String title,
        String category,
        BigDecimal price,
        int stock,
        ProductStatus status,
        String imageUrl,
        String description,
        Instant createdAt,
        Instant updatedAt
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getTitle(),
                product.getCategory(),
                product.getPrice(),
                product.getStock(),
                product.getStatus(),
                product.getImageUrl(),
                product.getDescription(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
