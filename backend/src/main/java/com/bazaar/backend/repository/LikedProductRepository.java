package com.bazaar.backend.repository;

import com.bazaar.backend.entity.LikedProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LikedProductRepository extends JpaRepository<LikedProduct, UUID> {

    List<LikedProduct> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<LikedProduct> findByUserIdAndProductId(UUID userId, UUID productId);

    void deleteByUserIdAndProductId(UUID userId, UUID productId);
}
