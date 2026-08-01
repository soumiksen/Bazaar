package com.bazaar.backend.service;

import com.bazaar.backend.config.CheckoutProperties;
import com.bazaar.backend.dto.checkout.CheckoutSessionResponse;
import com.bazaar.backend.entity.CartItem;
import com.bazaar.backend.entity.Order;
import com.bazaar.backend.entity.OrderItem;
import com.bazaar.backend.entity.OrderStatus;
import com.bazaar.backend.entity.Product;
import com.bazaar.backend.exception.CheckoutSessionCreationException;
import com.bazaar.backend.exception.EmptyCartException;
import com.bazaar.backend.exception.InsufficientStockException;
import com.bazaar.backend.repository.CartItemRepository;
import com.bazaar.backend.repository.OrderRepository;
import com.bazaar.backend.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class CheckoutService {

    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CheckoutProperties checkoutProperties;

    public CheckoutService(
            CartItemRepository cartItemRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            CheckoutProperties checkoutProperties
    ) {
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.checkoutProperties = checkoutProperties;
    }

    @Transactional
    public CheckoutSessionResponse createCheckoutSession(UUID userId) {
        List<CartItem> cartItems = cartItemRepository.findAllByUserIdOrderByCreatedAtDesc(userId);

        if (cartItems.isEmpty()) {
            throw new EmptyCartException("Your cart is empty");
        }

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (cartItem.getQuantity() > product.getStock()) {
                throw new InsufficientStockException("Only " + product.getStock() + " left in stock for " + product.getTitle());
            }
        }

        UUID orderId = UUID.randomUUID();
        BigDecimal subtotal = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .id(orderId)
                .user(userRepository.getReferenceById(userId))
                .status(OrderStatus.PENDING)
                .subtotal(subtotal)
                .build();

        cartItems.forEach(cartItem -> order.addItem(
                OrderItem.builder()
                        .product(cartItem.getProduct())
                        .title(cartItem.getProduct().getTitle())
                        .unitPrice(cartItem.getProduct().getPrice())
                        .quantity(cartItem.getQuantity())
                        .build()
        ));

        Session session = createStripeSession(orderId, userId, cartItems);
        order.setStripeCheckoutSessionId(session.getId());

        orderRepository.saveAndFlush(order);

        return new CheckoutSessionResponse(session.getUrl(), orderId);
    }

    private Session createStripeSession(UUID orderId, UUID userId, List<CartItem> cartItems) {
        List<SessionCreateParams.LineItem> lineItems = cartItems.stream()
                .map(cartItem -> SessionCreateParams.LineItem.builder()
                        .setQuantity((long) cartItem.getQuantity())
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("usd")
                                        .setUnitAmount(toCents(cartItem.getProduct().getPrice()))
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(cartItem.getProduct().getTitle())
                                                        .build()
                                        )
                                        .build()
                        )
                        .build())
                .toList();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(checkoutProperties.successUrl() + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(checkoutProperties.cancelUrl())
                .setClientReferenceId(userId.toString())
                .putMetadata("orderId", orderId.toString())
                .addAllLineItem(lineItems)
                .build();

        try {
            return Session.create(params);
        } catch (StripeException e) {
            throw new CheckoutSessionCreationException("Could not start checkout. Please try again.", e);
        }
    }

    private static long toCents(BigDecimal price) {
        return price.setScale(2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).longValueExact();
    }
}
