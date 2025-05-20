package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}
