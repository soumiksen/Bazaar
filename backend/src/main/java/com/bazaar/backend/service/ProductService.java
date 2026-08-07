package com.bazaar.backend.service;

import com.bazaar.backend.dto.product.CatalogProductResponse;
import com.bazaar.backend.dto.product.ProductDetailResponse;
import com.bazaar.backend.dto.product.ProductRequest;
import com.bazaar.backend.dto.product.ProductResponse;
import com.bazaar.backend.entity.Product;
import com.bazaar.backend.entity.ProductStatus;
import com.bazaar.backend.exception.ProductNotFoundException;
import com.bazaar.backend.repository.ProductRepository;
import com.bazaar.backend.repository.ProductReviewRepository;
import com.bazaar.backend.repository.ProductReviewRepository.ProductRatingSummary;
import com.bazaar.backend.repository.UserRepository;
import com.bazaar.backend.search.ProductSearchService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductSearchService productSearchService;
    private final ProductReviewRepository productReviewRepository;

    public ProductService(
            ProductRepository productRepository,
            UserRepository userRepository,
            ProductSearchService productSearchService,
            ProductReviewRepository productReviewRepository
    ) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productSearchService = productSearchService;
        this.productReviewRepository = productReviewRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listForVendor(UUID vendorId) {
        return productRepository.findAllByVendorIdOrderByCreatedAtDesc(vendorId).stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Cacheable(cacheNames = "products", key = "'all'")
    @Transactional(readOnly = true)
    public List<CatalogProductResponse> listActive() {
        List<Product> products = productRepository.findAllByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE);
        Map<UUID, ProductRatingSummary> ratings = ratingSummariesByProductId(products.stream().map(Product::getId).toList());

        return products.stream()
                .map(product -> {
                    ProductRatingSummary summary = ratings.get(product.getId());
                    return CatalogProductResponse.from(
                            product,
                            summary == null ? null : summary.getAverageRating(),
                            summary == null ? null : summary.getReviewCount()
                    );
                })
                .toList();
    }

    @Cacheable(cacheNames = "product", key = "#productId")
    @Transactional(readOnly = true)
    public ProductDetailResponse getActiveById(UUID productId) {
        Product product = productRepository.findByIdAndStatus(productId, ProductStatus.ACTIVE)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        ProductRatingSummary summary = ratingSummariesByProductId(List.of(productId)).get(productId);
        return ProductDetailResponse.from(
                product,
                summary == null ? null : summary.getAverageRating(),
                summary == null ? null : summary.getReviewCount()
        );
    }

    @Transactional(readOnly = true)
    public ProductResponse getForVendor(UUID vendorId, UUID productId) {
        return ProductResponse.from(requireOwnedProduct(vendorId, productId));
    }

    @CacheEvict(cacheNames = "products", key = "'all'")
    @Transactional
    public ProductResponse create(UUID vendorId, ProductRequest request) {
        Product product = Product.builder()
                .vendor(userRepository.getReferenceById(vendorId))
                .title(request.title().trim())
                .category(request.category().trim())
                .price(request.price())
                .stock(request.stock())
                .status(request.status())
                .imageUrl(blankToNull(request.imageUrl()))
                .description(blankToNull(request.description()))
                .build();

        Product saved = productRepository.saveAndFlush(product);
        productSearchService.syncProduct(saved);
        return ProductResponse.from(saved);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "products", key = "'all'"),
            @CacheEvict(cacheNames = "product", key = "#productId")
    })
    @Transactional
    public ProductResponse update(UUID vendorId, UUID productId, ProductRequest request) {
        Product product = requireOwnedProduct(vendorId, productId);

        product.setTitle(request.title().trim());
        product.setCategory(request.category().trim());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setStatus(request.status());
        product.setImageUrl(blankToNull(request.imageUrl()));
        product.setDescription(blankToNull(request.description()));

        Product saved = productRepository.saveAndFlush(product);
        productSearchService.syncProduct(saved);
        return ProductResponse.from(saved);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "products", key = "'all'"),
            @CacheEvict(cacheNames = "product", key = "#productId")
    })
    @Transactional
    public void delete(UUID vendorId, UUID productId) {
        Product product = requireOwnedProduct(vendorId, productId);
        productRepository.delete(product);
        productSearchService.deleteProduct(productId);
    }

    private Product requireOwnedProduct(UUID vendorId, UUID productId) {
        return productRepository.findByIdAndVendorId(productId, vendorId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private Map<UUID, ProductRatingSummary> ratingSummariesByProductId(List<UUID> productIds) {
        if (productIds.isEmpty()) {
            return Map.of();
        }
        return productReviewRepository.findRatingSummaries(productIds).stream()
                .collect(Collectors.toMap(ProductRatingSummary::getProductId, Function.identity()));
    }
}
