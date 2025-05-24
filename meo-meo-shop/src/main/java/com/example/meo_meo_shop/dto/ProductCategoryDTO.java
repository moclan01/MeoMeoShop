package com.example.meo_meo_shop.dto;

import lombok.Data;

@Data
public class ProductCategoryDTO {
    private Long productCategoryId;
    private ProductDTO product;
    private CategoryDTO category;

    @Data
    public static class ProductDTO {
        private Long productId;
        private String name;
        private String description;
        private double price;
        private int stock;
        private String imageUrl;
    }

    @Data
    public static class CategoryDTO {
        private Long categoryId;
        private String name;
        private String description;
    }
} 