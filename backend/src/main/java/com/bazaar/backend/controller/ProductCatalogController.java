package com.bazaar.backend.controller;

import com.bazaar.backend.dto.product.CatalogProductResponse;
import com.bazaar.backend.dto.product.ProductDetailResponse;
import com.bazaar.backend.search.ProductSearchService;
import com.bazaar.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductCatalogController {

    private final ProductService productService;
    private final ProductSearchService productSearchService;

    public ProductCatalogController(ProductService productService, ProductSearchService productSearchService) {
        this.productService = productService;
        this.productSearchService = productSearchService;
    }

    @GetMapping
    public ResponseEntity<List<CatalogProductResponse>> list() {
        return ResponseEntity.ok(productService.listActive());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CatalogProductResponse>> search(@RequestParam("q") String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.ok(List.of());
        }
        List<CatalogProductResponse> results = productSearchService.search(query).stream()
                .map(CatalogProductResponse::fromDocument)
                .toList();
        return ResponseEntity.ok(results);
    }

    @GetMapping("/search/suggest")
    public ResponseEntity<List<CatalogProductResponse>> suggest(@RequestParam("q") String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.ok(List.of());
        }
        List<CatalogProductResponse> suggestions = productSearchService.suggest(query).stream()
                .map(CatalogProductResponse::fromDocument)
                .toList();
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getActiveById(id));
    }
}
