package com.bazaar.backend.search;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class ProductIndexInitializer implements ApplicationRunner {

    private final ProductSearchService productSearchService;

    public ProductIndexInitializer(ProductSearchService productSearchService) {
        this.productSearchService = productSearchService;
    }

    @Override
    public void run(ApplicationArguments args) {
        productSearchService.reindexAll();
    }
}
