package com.example.meo_meo_shop.dto;

import lombok.Data;

@Data
public class UserRegistrationDTO {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    // Không bao gồm trường 'role'
} 