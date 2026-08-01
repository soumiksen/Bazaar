package com.bazaar.backend.dto.order;

import com.bazaar.backend.entity.Order;
import com.bazaar.backend.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderSummaryResponse(
        UUID id,
        OrderStatus status,
        BigDecimal subtotal,
        int itemCount,
        Instant createdAt
) {
    public static OrderSummaryResponse from(Order order) {
        return new OrderSummaryResponse(
                order.getId(),
                order.getStatus(),
                order.getSubtotal(),
                order.getItems().size(),
                order.getCreatedAt()
        );
    }
}
