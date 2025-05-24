package com.example.meo_meo_shop.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long cartItemId;
    private ProductSimpleDTO product;
    private int quantity;
    private Long cartId; // Thêm cartId để biết mục này thuộc giỏ hàng nào

    @Data
    public static class ProductSimpleDTO {
        private Long productId;
        private String name;
        private String imageUrl;
        private double price;
    }
} 