package com.bazaar.backend.repository;

import com.bazaar.backend.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductReviewRepository extends JpaRepository<ProductReview, UUID> {

    List<ProductReview> findAllByProductIdOrderByCreatedAtDesc(UUID productId);

    Optional<ProductReview> findByUserIdAndProductId(UUID userId, UUID productId);

    void deleteByUserIdAndProductId(UUID userId, UUID productId);

    @Query("""
            SELECT r.product.id AS productId, AVG(r.rating) AS averageRating, COUNT(r) AS reviewCount
            FROM ProductReview r
            WHERE r.product.id IN :productIds
            GROUP BY r.product.id
            """)
    List<ProductRatingSummary> findRatingSummaries(@Param("productIds") Collection<UUID> productIds);

    interface ProductRatingSummary {
        UUID getProductId();
        Double getAverageRating();
        Long getReviewCount();
    }
}
