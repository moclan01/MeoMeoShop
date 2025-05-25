package com.example.meo_meo_shop.dto;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Long orderItemId;
    private ProductSimpleDTO product;
    private int quantity;
    private double pricePerUnit;

    @Data
    public static class ProductSimpleDTO {
        private Long productId;
        private String name;
        private String imageUrl;
        private double price;
    }
} 