package com.bazaar.backend.dto.product;

import com.bazaar.backend.entity.Product;
import com.bazaar.backend.search.ProductDocument;

import java.math.BigDecimal;
import java.util.UUID;

public record CatalogProductResponse(
        UUID id,
        String title,
        String category,
        BigDecimal price,
        String imageUrl,
        double averageRating,
        int reviewCount
) {
    public static CatalogProductResponse from(Product product, Double averageRating, Long reviewCount) {
        return new CatalogProductResponse(
                product.getId(),
                product.getTitle(),
                product.getCategory(),
                product.getPrice(),
                product.getImageUrl(),
                averageRating == null ? 0.0 : averageRating,
                reviewCount == null ? 0 : reviewCount.intValue()
        );
    }

    public static CatalogProductResponse fromDocument(ProductDocument document) {
        return new CatalogProductResponse(
                UUID.fromString(document.getId()),
                document.getTitle(),
                document.getCategory(),
                BigDecimal.valueOf(document.getPrice()),
                document.getImageUrl(),
                0.0,
                0
        );
    }
}
