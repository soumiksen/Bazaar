package com.bazaar.backend.service;

import com.bazaar.backend.dto.order.OrderResponse;
import com.bazaar.backend.dto.order.OrderSummaryResponse;
import com.bazaar.backend.exception.OrderNotFoundException;
import com.bazaar.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> listOrders(UUID userId) {
        return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderSummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(UUID userId, UUID orderId) {
        return OrderResponse.from(
                orderRepository.findByIdAndUserId(orderId, userId)
                        .orElseThrow(() -> new OrderNotFoundException("Order not found"))
        );
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderBySession(UUID userId, String sessionId) {
        return OrderResponse.from(
                orderRepository.findByStripeCheckoutSessionIdAndUserId(sessionId, userId)
                        .orElseThrow(() -> new OrderNotFoundException("Order not found yet. It may still be processing."))
        );
    }
}
