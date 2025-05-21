package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
}
