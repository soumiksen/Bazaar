package com.bazaar.backend.repository;

import com.bazaar.backend.entity.Product;
import com.bazaar.backend.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findAllByVendorIdOrderByCreatedAtDesc(UUID vendorId);

    Optional<Product> findByIdAndVendorId(UUID id, UUID vendorId);

    List<Product> findAllByStatusOrderByCreatedAtDesc(ProductStatus status);
}
