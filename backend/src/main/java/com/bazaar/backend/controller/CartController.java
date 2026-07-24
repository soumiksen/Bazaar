package com.bazaar.backend.controller;

import com.bazaar.backend.dto.cart.CartItemQuantityRequest;
import com.bazaar.backend.dto.cart.CartItemRequest;
import com.bazaar.backend.dto.cart.CartResponse;
import com.bazaar.backend.security.UserPrincipal;
import com.bazaar.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getId()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody CartItemRequest request
    ) {
        CartResponse response = cartService.addItem(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/items/{id}")
    public ResponseEntity<CartResponse> updateQuantity(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody CartItemQuantityRequest request
    ) {
        return ResponseEntity.ok(cartService.updateQuantity(principal.getId(), id, request.quantity()));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<CartResponse> removeItem(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID id
    ) {
        return ResponseEntity.ok(cartService.removeItem(principal.getId(), id));
    }
}
