package com.bazaar.backend.controller;

import com.bazaar.backend.dto.checkout.CheckoutSessionResponse;
import com.bazaar.backend.security.UserPrincipal;
import com.bazaar.backend.service.CheckoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/session")
    public ResponseEntity<CheckoutSessionResponse> createSession(@AuthenticationPrincipal UserPrincipal principal) {
        CheckoutSessionResponse response = checkoutService.createCheckoutSession(principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
