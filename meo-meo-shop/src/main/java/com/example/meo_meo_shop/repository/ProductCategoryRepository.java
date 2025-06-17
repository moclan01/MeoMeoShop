package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    List<ProductCategory> findByProduct_ProductId(Long productId);
    List<ProductCategory> findByCategory_CategoryId(Long categoryId);
    void deleteByCategory_CategoryId(Long categoryId);
}
