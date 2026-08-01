package com.bazaar.backend.controller;

import com.bazaar.backend.dto.order.OrderResponse;
import com.bazaar.backend.dto.order.OrderSummaryResponse;
import com.bazaar.backend.security.UserPrincipal;
import com.bazaar.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderSummaryResponse>> list(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(orderService.listOrders(principal.getId()));
    }

    @GetMapping("/by-session/{sessionId}")
    public ResponseEntity<OrderResponse> getBySession(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable String sessionId
    ) {
        return ResponseEntity.ok(orderService.getOrderBySession(principal.getId(), sessionId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> get(@AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrder(principal.getId(), id));
    }
}
