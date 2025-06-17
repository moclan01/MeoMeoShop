package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.ProductCategory;
import com.example.meo_meo_shop.repository.ProductCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        if (updatedProductCategory.getProduct() != null) {
            existing.setProduct(updatedProductCategory.getProduct());
        }
        if (updatedProductCategory.getCategory() != null) {
            existing.setCategory(updatedProductCategory.getCategory());
        }

        return productCategoryRepository.save(existing);
    }

    public List<ProductCategory> getByProductId(Long productId) {
        return productCategoryRepository.findByProduct_ProductId(productId);
    }

    public List<ProductCategory> getByCategoryId(Long categoryId) {
        return productCategoryRepository.findByCategory_CategoryId(categoryId);
    }

    @Transactional
    public void deleteByProductId(Long productId) {
        List<ProductCategory> list = productCategoryRepository.findByProduct_ProductId(productId);

        if (list == null || list.isEmpty()) {
            System.out.println("Không tìm thấy ProductCategory nào với productId = " + productId);
            return;
        }

        try {
            productCategoryRepository.deleteAll(list);
            System.out.println("Đã xóa " + list.size() + " product-category mappings.");
        } catch (Exception e) {
            System.err.println("Lỗi khi xóa product-category mappings:");
            e.printStackTrace();
            throw e; // để controller bắt được lỗi đúng
        }
    }

    @Transactional
    public void deleteByCategoryId(Long categoryId) {
        productCategoryRepository.deleteByCategory_CategoryId(categoryId);
    }

}
