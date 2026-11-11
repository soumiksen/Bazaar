package com.bazaar.backend.repository;

import com.bazaar.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    @Query("""
            SELECT oi.product.id AS productId, SUM(oi.quantity) AS unitsSold
            FROM OrderItem oi
            WHERE oi.product IS NOT NULL AND oi.order.status = com.bazaar.backend.entity.OrderStatus.PAID
            GROUP BY oi.product.id
            """)
    List<ProductSales> findUnitsSoldPerProduct();

    interface ProductSales {
        UUID getProductId();
        Long getUnitsSold();
    }
}
