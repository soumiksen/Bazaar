package com.bazaar.backend.service;

import com.bazaar.backend.dto.cart.CartItemRequest;
import com.bazaar.backend.dto.cart.CartResponse;
import com.bazaar.backend.entity.CartItem;
import com.bazaar.backend.entity.Product;
import com.bazaar.backend.entity.ProductStatus;
import com.bazaar.backend.exception.CartItemNotFoundException;
import com.bazaar.backend.exception.InsufficientStockException;
import com.bazaar.backend.exception.ProductNotFoundException;
import com.bazaar.backend.repository.CartItemRepository;
import com.bazaar.backend.repository.ProductRepository;
import com.bazaar.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartItemRepository cartItemRepository, ProductRepository productRepository, UserRepository userRepository
    ) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(UUID userId) {
        return CartResponse.from(cartItemRepository.findAllByUserIdOrderByCreatedAtDesc(userId));
    }

    @Transactional
    public CartResponse addItem(UUID userId, CartItemRequest request) {
        Product product = productRepository.findByIdAndStatus(request.productId(), ProductStatus.ACTIVE)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(userId, product.getId())
                .orElseGet(() -> CartItem.builder()
                        .user(userRepository.getReferenceById(userId))
                        .product(product)
                        .quantity(0)
                        .build());

        int nextQuantity = cartItem.getQuantity() + request.quantity();
        requireInStock(product, nextQuantity);
        cartItem.setQuantity(nextQuantity);
        cartItemRepository.saveAndFlush(cartItem);

        return getCart(userId);
    }

    @Transactional
    public CartResponse updateQuantity(UUID userId, UUID cartItemId, int quantity) {
        CartItem cartItem = requireOwnedItem(userId, cartItemId);
        requireInStock(cartItem.getProduct(), quantity);
        cartItem.setQuantity(quantity);
        cartItemRepository.saveAndFlush(cartItem);

        return getCart(userId);
    }

    @Transactional
    public CartResponse removeItem(UUID userId, UUID cartItemId) {
        CartItem cartItem = requireOwnedItem(userId, cartItemId);
        cartItemRepository.delete(cartItem);

        return getCart(userId);
    }

    private CartItem requireOwnedItem(UUID userId, UUID cartItemId) {
        return cartItemRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found"));
    }

    private void requireInStock(Product product, int quantity) {
        if (quantity > product.getStock()) {
            throw new InsufficientStockException("Only " + product.getStock() + " left in stock");
        }
    }
}
