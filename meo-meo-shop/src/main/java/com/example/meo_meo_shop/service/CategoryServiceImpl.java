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

        if (updatedCategory.getName() != null) {
            existing.setName(updatedCategory.getName());
        }
        if (updatedCategory.getDescription() != null) {
            existing.setDescription(updatedCategory.getDescription());
        }

        return categoryRepository.save(existing);
    }

    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }
}
