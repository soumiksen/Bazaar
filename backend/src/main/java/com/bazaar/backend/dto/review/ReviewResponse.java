package com.bazaar.backend.dto.review;

import com.bazaar.backend.entity.ProductReview;

import java.time.Instant;
import java.util.UUID;

public record ReviewResponse(
        UUID id,
        UUID productId,
        UUID userId,
        String userName,
        int rating,
        String comment,
        Instant createdAt,
        Instant updatedAt
) {
    public static ReviewResponse from(ProductReview review) {
        return new ReviewResponse(
                review.getId(),
                review.getProduct().getId(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
