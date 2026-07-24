package com.bazaar.backend.search;

import com.bazaar.backend.entity.Product;
import com.bazaar.backend.entity.ProductStatus;
import com.bazaar.backend.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Search indexing/querying is a best-effort enhancement on top of the Postgres-backed catalog:
 * failures here are logged and swallowed rather than propagated, so a degraded or unavailable
 * Elasticsearch cluster never breaks product CRUD or the catalog itself.
 */
@Service
@Slf4j
public class ProductSearchService {

    private static final int SEARCH_RESULT_LIMIT = 24;
    private static final int SUGGESTION_LIMIT = 6;

    private final ProductSearchRepository productSearchRepository;
    private final ProductRepository productRepository;

    public ProductSearchService(ProductSearchRepository productSearchRepository, ProductRepository productRepository) {
        this.productSearchRepository = productSearchRepository;
        this.productRepository = productRepository;
    }

    public List<ProductDocument> search(String query) {
        try {
            return productSearchRepository.search(query, PageRequest.of(0, SEARCH_RESULT_LIMIT));
        } catch (Exception ex) {
            log.warn("Product search failed for query '{}'", query, ex);
            return List.of();
        }
    }

    public List<ProductDocument> suggest(String prefix) {
        try {
            return productSearchRepository.suggest(prefix, PageRequest.of(0, SUGGESTION_LIMIT));
        } catch (Exception ex) {
            log.warn("Product suggest failed for prefix '{}'", prefix, ex);
            return List.of();
        }
    }

    public void syncProduct(Product product) {
        try {
            if (product.getStatus() == ProductStatus.ACTIVE) {
                productSearchRepository.save(ProductDocument.from(product));
            } else {
                productSearchRepository.deleteById(product.getId().toString());
            }
        } catch (Exception ex) {
            log.warn("Failed to sync product {} to the search index", product.getId(), ex);
        }
    }

    public void deleteProduct(UUID productId) {
        try {
            productSearchRepository.deleteById(productId.toString());
        } catch (Exception ex) {
            log.warn("Failed to remove product {} from the search index", productId, ex);
        }
    }

    @Transactional(readOnly = true)
    public void reindexAll() {
        try {
            List<ProductDocument> documents = productRepository.findAllByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE)
                    .stream()
                    .map(ProductDocument::from)
                    .toList();
            productSearchRepository.saveAll(documents);
            log.info("Reindexed {} active products into Elasticsearch", documents.size());
        } catch (Exception ex) {
            log.warn("Failed to reindex products into Elasticsearch; search will be unavailable until this succeeds", ex);
        }
    }
}
