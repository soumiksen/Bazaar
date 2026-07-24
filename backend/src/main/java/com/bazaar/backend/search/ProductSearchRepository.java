package com.bazaar.backend.search;

import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface ProductSearchRepository extends ElasticsearchRepository<ProductDocument, String> {

    @Query("""
            {
              "multi_match": {
                "query": "?0",
                "fields": ["title^3", "category^2", "description", "vendorName"],
                "fuzziness": "AUTO"
              }
            }
            """)
    List<ProductDocument> search(String query, Pageable pageable);

    @Query("""
            {
              "multi_match": {
                "query": "?0",
                "type": "bool_prefix",
                "fields": ["title", "title._2gram", "title._3gram"]
              }
            }
            """)
    List<ProductDocument> suggest(String prefix, Pageable pageable);
}
