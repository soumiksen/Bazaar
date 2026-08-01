package com.bazaar.backend.dto.review;

import com.bazaar.backend.entity.ProductReview;

import java.util.List;

public record ProductReviewsResponse(
        List<ReviewResponse> items,
        int totalCount,
        double averageRating
) {
    public static ProductReviewsResponse from(List<ProductReview> reviews) {
        List<ReviewResponse> items = reviews.stream().map(ReviewResponse::from).toList();
        double averageRating = reviews.isEmpty()
                ? 0.0
                : reviews.stream().mapToInt(ProductReview::getRating).average().orElse(0.0);
        return new ProductReviewsResponse(items, items.size(), averageRating);
    }
}
