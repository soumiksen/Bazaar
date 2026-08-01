package com.bazaar.backend.controller;

import com.bazaar.backend.dto.review.ProductReviewsResponse;
import com.bazaar.backend.dto.review.ReviewRequest;
import com.bazaar.backend.security.UserPrincipal;
import com.bazaar.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<ProductReviewsResponse> getReviews(@PathVariable UUID productId) {
        return ResponseEntity.ok(reviewService.getReviews(productId));
    }

    @PostMapping
    public ResponseEntity<ProductReviewsResponse> createReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId,
            @Valid @RequestBody ReviewRequest request
    ) {
        ProductReviewsResponse response = reviewService.createReview(principal.getId(), productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping
    public ResponseEntity<ProductReviewsResponse> updateReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId,
            @Valid @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.ok(reviewService.updateReview(principal.getId(), productId, request));
    }

    @DeleteMapping
    public ResponseEntity<ProductReviewsResponse> deleteReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId
    ) {
        return ResponseEntity.ok(reviewService.deleteReview(principal.getId(), productId));
    }
}
