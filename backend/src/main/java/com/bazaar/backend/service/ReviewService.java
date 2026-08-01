package com.bazaar.backend.service;

import com.bazaar.backend.dto.review.ProductReviewsResponse;
import com.bazaar.backend.dto.review.ReviewRequest;
import com.bazaar.backend.entity.Product;
import com.bazaar.backend.entity.ProductReview;
import com.bazaar.backend.entity.ProductStatus;
import com.bazaar.backend.exception.DuplicateReviewException;
import com.bazaar.backend.exception.ProductNotFoundException;
import com.bazaar.backend.exception.ReviewNotFoundException;
import com.bazaar.backend.repository.ProductRepository;
import com.bazaar.backend.repository.ProductReviewRepository;
import com.bazaar.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(
            ProductReviewRepository productReviewRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.productReviewRepository = productReviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public ProductReviewsResponse getReviews(UUID productId) {
        return ProductReviewsResponse.from(productReviewRepository.findAllByProductIdOrderByCreatedAtDesc(productId));
    }

    @Transactional
    public ProductReviewsResponse createReview(UUID userId, UUID productId, ReviewRequest request) {
        Product product = productRepository.findByIdAndStatus(productId, ProductStatus.ACTIVE)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (productReviewRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
            throw new DuplicateReviewException("You have already reviewed this product");
        }

        ProductReview review = ProductReview.builder()
                .user(userRepository.getReferenceById(userId))
                .product(product)
                .rating(request.rating())
                .comment(blankToNull(request.comment()))
                .build();

        productReviewRepository.saveAndFlush(review);
        return getReviews(productId);
    }

    @Transactional
    public ProductReviewsResponse updateReview(UUID userId, UUID productId, ReviewRequest request) {
        ProductReview review = productReviewRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new ReviewNotFoundException("You haven't reviewed this product yet"));

        review.setRating(request.rating());
        review.setComment(blankToNull(request.comment()));
        productReviewRepository.saveAndFlush(review);
        return getReviews(productId);
    }

    @Transactional
    public ProductReviewsResponse deleteReview(UUID userId, UUID productId) {
        ProductReview review = productReviewRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new ReviewNotFoundException("You haven't reviewed this product yet"));

        productReviewRepository.delete(review);
        return getReviews(productId);
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}
