package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // Thêm method để tìm Cart theo User ID
    Optional<Cart> findByUser_UserId(String userId);
}
