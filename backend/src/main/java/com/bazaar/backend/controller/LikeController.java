package com.bazaar.backend.controller;

import com.bazaar.backend.dto.like.LikeRequest;
import com.bazaar.backend.dto.like.LikesResponse;
import com.bazaar.backend.security.UserPrincipal;
import com.bazaar.backend.service.LikeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @GetMapping
    public ResponseEntity<LikesResponse> getLikes(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(likeService.getLikes(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<LikesResponse> like(
            @AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody LikeRequest request
    ) {
        LikesResponse response = likeService.like(principal.getId(), request.productId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<LikesResponse> unlike(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID productId
    ) {
        return ResponseEntity.ok(likeService.unlike(principal.getId(), productId));
    }
}
