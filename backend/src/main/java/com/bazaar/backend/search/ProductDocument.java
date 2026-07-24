package com.bazaar.backend.search;

import com.bazaar.backend.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;

@Document(indexName = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDocument {

    @Id
    private String id;

    @Field(type = FieldType.Search_As_You_Type)
    private String title;

    @Field(type = FieldType.Text)
    private String category;

    @Field(type = FieldType.Text)
    private String description;

    @Field(type = FieldType.Text)
    private String vendorName;

    @Field(type = FieldType.Double)
    private double price;

    @Field(type = FieldType.Keyword, index = false)
    private String imageUrl;

    @Field(type = FieldType.Integer)
    private int stock;

    @Field(type = FieldType.Date)
    private Instant createdAt;

    public static ProductDocument from(Product product) {
        return ProductDocument.builder()
                .id(product.getId().toString())
                .title(product.getTitle())
                .category(product.getCategory())
                .description(product.getDescription())
                .vendorName(product.getVendor().getName())
                .price(product.getPrice().doubleValue())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
