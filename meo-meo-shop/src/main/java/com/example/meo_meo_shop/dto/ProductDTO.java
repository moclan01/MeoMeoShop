package com.example.meo_meo_shop.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductDTO {
    private Long productId;
    private String name;
    private String description;
    private double price;
    private int stock;
    private String imageUrl;
    private List<CategoryDTO> categories;

    @Data
    public static class CategoryDTO {
        private Long categoryId;
        private String name;
        private String description;
    }
} 