package com.bazaar.backend.dto.order;

import com.bazaar.backend.entity.OrderItem;
import com.bazaar.backend.entity.Product;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(
        UUID id,
        UUID productId,
        String title,
        BigDecimal unitPrice,
        int quantity
) {
    public static OrderItemResponse from(OrderItem item) {
        Product product = item.getProduct();
        return new OrderItemResponse(
                item.getId(),
                product == null ? null : product.getId(),
                item.getTitle(),
                item.getUnitPrice(),
                item.getQuantity()
        );
    }
}
