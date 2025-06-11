package com.example.meo_meo_shop.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
public class OrderDTO {
    private Long orderId;
    private String paypalOrderId;
    private UserSimpleDTO user;
    private LocalDate orderDate;
    private double totalAmount;
    private String status;
    private String shippingAddress;
    private String phone;
    private List<OrderItemDTO> orderItems;

    @Data
    public static class UserSimpleDTO {
        private String userId;
        private String name;
        private String email;
    }
} 