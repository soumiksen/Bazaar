package com.bazaar.backend.dto.product;

import com.bazaar.backend.entity.Product;
import com.bazaar.backend.search.ProductDocument;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CatalogProductResponse(
        UUID id,
        String title,
        String category,
        BigDecimal price,
        BigDecimal compareAtPrice,
        String imageUrl,
        double averageRating,
        int reviewCount,
        UUID vendorId,
        String vendorName,
        boolean vendorVerified,
        Instant createdAt,
        long unitsSold
) {
    public static CatalogProductResponse from(Product product, Double averageRating, Long reviewCount, Long unitsSold) {
        return new CatalogProductResponse(
                product.getId(),
                product.getTitle(),
                product.getCategory(),
                product.getPrice(),
                product.getCompareAtPrice(),
                product.getImageUrl(),
                averageRating == null ? 0.0 : averageRating,
                reviewCount == null ? 0 : reviewCount.intValue(),
                product.getVendor().getId(),
                product.getVendor().getName(),
                product.getVendor().isVerified(),
                product.getCreatedAt(),
                unitsSold == null ? 0L : unitsSold
        );
    }

    public static CatalogProductResponse fromDocument(ProductDocument document) {
        return new CatalogProductResponse(
                UUID.fromString(document.getId()),
                document.getTitle(),
                document.getCategory(),
                BigDecimal.valueOf(document.getPrice()),
                null,
                document.getImageUrl(),
                0.0,
                0,
                null,
                document.getVendorName(),
                false,
                null,
                0L
        );
    }
}
