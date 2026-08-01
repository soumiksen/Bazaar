package com.bazaar.backend.service;

import com.bazaar.backend.config.StripeProperties;
import com.bazaar.backend.entity.Order;
import com.bazaar.backend.entity.OrderStatus;
import com.bazaar.backend.entity.Product;
import com.bazaar.backend.exception.InvalidWebhookSignatureException;
import com.bazaar.backend.repository.CartItemRepository;
import com.bazaar.backend.repository.OrderRepository;
import com.bazaar.backend.repository.ProductRepository;
import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class StripeWebhookService {

    private static final Logger log = LoggerFactory.getLogger(StripeWebhookService.class);

    private final StripeProperties stripeProperties;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    public StripeWebhookService(
            StripeProperties stripeProperties,
            OrderRepository orderRepository,
            ProductRepository productRepository,
            CartItemRepository cartItemRepository
    ) {
        this.stripeProperties = stripeProperties;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public void handleWebhook(String payload, String signatureHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, signatureHeader, stripeProperties.webhookSecret());
        } catch (SignatureVerificationException e) {
            throw new InvalidWebhookSignatureException("Invalid Stripe webhook signature");
        }

        switch (event.getType()) {
            case "checkout.session.completed", "checkout.session.async_payment_succeeded" -> handlePaymentSucceeded(event);
            case "checkout.session.async_payment_failed", "checkout.session.expired" -> handlePaymentFailed(event);
            default -> log.debug("Ignoring unhandled Stripe event type: {}", event.getType());
        }
    }

    private void handlePaymentSucceeded(Event event) {
        Session session = deserializeSession(event);
        if (session == null) {
            return;
        }

        UUID orderId = extractOrderId(session);
        if (orderId == null) {
            log.warn("Stripe session {} completed with no orderId in metadata", session.getId());
            return;
        }

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null || order.getStatus() != OrderStatus.PENDING) {
            return;
        }

        for (var item : order.getItems()) {
            Product product = item.getProduct();
            if (product != null) {
                product.setStock(Math.max(0, product.getStock() - item.getQuantity()));
                productRepository.save(product);
            }
        }

        order.setStatus(OrderStatus.PAID);
        order.setStripePaymentIntentId(session.getPaymentIntent());
        orderRepository.save(order);

        cartItemRepository.deleteAllByUserId(order.getUser().getId());
    }

    private void handlePaymentFailed(Event event) {
        Session session = deserializeSession(event);
        if (session == null) {
            return;
        }

        UUID orderId = extractOrderId(session);
        if (orderId == null) {
            return;
        }

        orderRepository.findById(orderId)
                .filter(order -> order.getStatus() == OrderStatus.PENDING)
                .ifPresent(order -> {
                    order.setStatus(OrderStatus.FAILED);
                    orderRepository.save(order);
                });
    }

    private Session deserializeSession(Event event) {
        var deserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = deserializer.getObject().orElse(null);

        if (stripeObject == null) {
            try {
                stripeObject = deserializer.deserializeUnsafe();
            } catch (EventDataObjectDeserializationException e) {
                log.warn("Could not deserialize Stripe event {} payload", event.getId(), e);
                return null;
            }
        }

        return stripeObject instanceof Session session ? session : null;
    }

    private UUID extractOrderId(Session session) {
        String orderId = session.getMetadata() == null ? null : session.getMetadata().get("orderId");
        if (orderId == null) {
            return null;
        }
        try {
            return UUID.fromString(orderId);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
