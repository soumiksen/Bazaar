package com.bazaar.backend.service;

import com.bazaar.backend.dto.like.LikesResponse;
import com.bazaar.backend.entity.LikedProduct;
import com.bazaar.backend.entity.Product;
import com.bazaar.backend.entity.ProductStatus;
import com.bazaar.backend.exception.ProductNotFoundException;
import com.bazaar.backend.repository.LikedProductRepository;
import com.bazaar.backend.repository.ProductRepository;
import com.bazaar.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class LikeService {

    private final LikedProductRepository likedProductRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public LikeService(
            LikedProductRepository likedProductRepository, ProductRepository productRepository, UserRepository userRepository
    ) {
        this.likedProductRepository = likedProductRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public LikesResponse getLikes(UUID userId) {
        return LikesResponse.from(likedProductRepository.findAllByUserIdOrderByCreatedAtDesc(userId));
    }

    @Transactional
    public LikesResponse like(UUID userId, UUID productId) {
        boolean alreadyLiked = likedProductRepository.findByUserIdAndProductId(userId, productId).isPresent();

        if (!alreadyLiked) {
            Product product = productRepository.findByIdAndStatus(productId, ProductStatus.ACTIVE)
                    .orElseThrow(() -> new ProductNotFoundException("Product not found"));

            LikedProduct likedProduct = LikedProduct.builder()
                    .user(userRepository.getReferenceById(userId))
                    .product(product)
                    .build();

            likedProductRepository.saveAndFlush(likedProduct);
        }

        return getLikes(userId);
    }

    @Transactional
    public LikesResponse unlike(UUID userId, UUID productId) {
        likedProductRepository.deleteByUserIdAndProductId(userId, productId);
        return getLikes(userId);
    }
}
