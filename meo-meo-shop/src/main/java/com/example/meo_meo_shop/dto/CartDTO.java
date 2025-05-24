package com.example.meo_meo_shop.dto;

import lombok.Data;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CartDTO {
    private Long cartId;
    private UserSimpleDTO user;
    private List<CartItemDTO> items;

    @Data
    public static class UserSimpleDTO {
        private String userId;
        private String name;
        private String email;
    }
} 