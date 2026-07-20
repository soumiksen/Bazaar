package com.bazaar.backend.controller;

import com.bazaar.backend.dto.product.CatalogProductResponse;
import com.bazaar.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductCatalogController {

    private final ProductService productService;

    public ProductCatalogController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<CatalogProductResponse>> list() {
        return ResponseEntity.ok(productService.listActive());
    }
}
