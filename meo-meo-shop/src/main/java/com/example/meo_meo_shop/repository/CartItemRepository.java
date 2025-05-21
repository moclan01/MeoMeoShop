package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
