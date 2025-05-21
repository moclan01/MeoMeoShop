package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Product;
import com.example.meo_meo_shop.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl extends AServiceImpl<Product, Long> implements IService<Product, Long>{
    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        super(productRepository);
        this.productRepository = productRepository;
    }

    @Override
    public Product update(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setStock(updatedProduct.getStock());
        existing.setImageUrl(updatedProduct.getImageUrl());

        // Không cập nhật trực tiếp productCategories ở đây nếu bạn đang quản lý qua ProductCategoryService

        return productRepository.save(existing);
    }

    // Nếu bạn muốn thêm các hàm tiện ích như tìm theo tên:
    public List<Product> findByNameContaining(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
}
