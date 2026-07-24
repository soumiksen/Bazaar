package com.bazaar.backend.dto.like;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record LikeRequest(

        @NotNull(message = "Product id is required")
        UUID productId
) {
}
