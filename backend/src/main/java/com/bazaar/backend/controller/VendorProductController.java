package com.bazaar.backend.controller;

import com.bazaar.backend.dto.product.ProductRequest;
import com.bazaar.backend.dto.product.ProductResponse;
import com.bazaar.backend.security.UserPrincipal;
import com.bazaar.backend.service.ProductService;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vendor/products")
public class VendorProductController {

    private final ProductService productService;

    public VendorProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> list(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(productService.listForVendor(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID id
    ) {
        return ResponseEntity.ok(productService.getForVendor(principal.getId(), id));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody ProductRequest request
    ) {
        ProductResponse response = productService.create(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.update(principal.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID id
    ) {
        productService.delete(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
