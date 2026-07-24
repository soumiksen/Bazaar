package com.bazaar.backend.dto.like;

import com.bazaar.backend.entity.LikedProduct;

import java.util.List;

public record LikesResponse(
        List<LikedProductResponse> items,
        int totalCount
) {
    public static LikesResponse from(List<LikedProduct> likedProducts) {
        List<LikedProductResponse> items = likedProducts.stream().map(LikedProductResponse::from).toList();
        return new LikesResponse(items, items.size());
    }
}
