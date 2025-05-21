package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Category;
import com.example.meo_meo_shop.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CategoryServiceImpl extends AServiceImpl<Category, Long> implements IService<Category, Long>{
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        super(categoryRepository);
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category update(Long id, Category updatedCategory) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));

        existing.setName(updatedCategory.getName());
        existing.setDescription(updatedCategory.getDescription());

        // Nếu cần cập nhật productCategories thì xử lý thêm ở đây
        // Thường thì productCategories được quản lý riêng nên không update trực tiếp ở đây

        return categoryRepository.save(existing);
    }

    // Bạn có thể thêm các phương thức đặc thù nếu cần, ví dụ tìm category theo tên
    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }
}
