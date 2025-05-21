package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.ProductCategory;
import com.example.meo_meo_shop.repository.ProductCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCategoryServiceImpl extends AServiceImpl<ProductCategory, Long> implements IService<ProductCategory, Long> {
    private final ProductCategoryRepository productCategoryRepository;
    public ProductCategoryServiceImpl(ProductCategoryRepository productCategoryRepository) {
        super(productCategoryRepository);
        this.productCategoryRepository = productCategoryRepository;
    }

    @Override
    public ProductCategory update(Long id, ProductCategory updatedProductCategory) {
        ProductCategory existing = productCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ProductCategory not found with ID: " + id));

        // Cập nhật các trường cần thiết, ví dụ product và category
        existing.setProduct(updatedProductCategory.getProduct());
        existing.setCategory(updatedProductCategory.getCategory());

        return productCategoryRepository.save(existing);
    }

    public List<ProductCategory> getByProductId(Long productId) {
        return productCategoryRepository.findByProduct_ProductId(productId);
    }

    public List<ProductCategory> getByCategoryId(Long categoryId) {
        return productCategoryRepository.findByCategory_CategoryId(categoryId);
    }

    public void deleteByProductId(Long productId) {
        productCategoryRepository.deleteByProduct_ProductId(productId);
    }

    public void deleteByCategoryId(Long categoryId) {
        productCategoryRepository.deleteByCategory_CategoryId(categoryId);
    }
}
