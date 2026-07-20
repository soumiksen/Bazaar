package com.bazaar.backend.service;

import com.bazaar.backend.dto.product.CatalogProductResponse;
import com.bazaar.backend.dto.product.ProductRequest;
import com.bazaar.backend.dto.product.ProductResponse;
import com.bazaar.backend.entity.Product;
import com.bazaar.backend.entity.ProductStatus;
import com.bazaar.backend.exception.ProductNotFoundException;
import com.bazaar.backend.repository.ProductRepository;
import com.bazaar.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listForVendor(UUID vendorId) {
        return productRepository.findAllByVendorIdOrderByCreatedAtDesc(vendorId).stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CatalogProductResponse> listActive() {
        return productRepository.findAllByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE).stream()
                .map(CatalogProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getForVendor(UUID vendorId, UUID productId) {
        return ProductResponse.from(requireOwnedProduct(vendorId, productId));
    }

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
        return ProductResponse.from(saved);
    }

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
        return ProductResponse.from(saved);
    }

    @Transactional
    public void delete(UUID vendorId, UUID productId) {
        Product product = requireOwnedProduct(vendorId, productId);
        productRepository.delete(product);
    }

    private Product requireOwnedProduct(UUID vendorId, UUID productId) {
        return productRepository.findByIdAndVendorId(productId, vendorId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}
