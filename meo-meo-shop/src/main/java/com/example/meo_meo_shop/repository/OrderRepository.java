package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
