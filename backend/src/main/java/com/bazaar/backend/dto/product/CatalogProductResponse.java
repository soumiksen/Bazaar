package com.bazaar.backend.dto.product;

import com.bazaar.backend.entity.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record CatalogProductResponse(
        UUID id,
        String title,
        String category,
        BigDecimal price,
        String imageUrl
) {
    public static CatalogProductResponse from(Product product) {
        return new CatalogProductResponse(
                product.getId(),
                product.getTitle(),
                product.getCategory(),
                product.getPrice(),
                product.getImageUrl()
        );
    }
}
