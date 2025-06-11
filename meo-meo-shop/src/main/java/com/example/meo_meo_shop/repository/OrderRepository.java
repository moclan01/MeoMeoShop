package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByPaypalOrderId(String paypalOrderId);
}
