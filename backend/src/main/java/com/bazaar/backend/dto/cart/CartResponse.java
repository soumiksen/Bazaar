package com.bazaar.backend.dto.cart;

import com.bazaar.backend.entity.CartItem;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        int totalQuantity,
        BigDecimal subtotal
) {
    public static CartResponse from(List<CartItem> cartItems) {
        List<CartItemResponse> items = cartItems.stream().map(CartItemResponse::from).toList();

        int totalQuantity = items.stream().mapToInt(CartItemResponse::quantity).sum();

        BigDecimal subtotal = items.stream()
                .map(item -> item.price().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(items, totalQuantity, subtotal);
    }
}
