package com.example.meo_meo_shop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Random;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(name = "user_id", length = 12)
    private String userId;

    private String name;

    @Column(unique = true)
    private String email;
    private String phone;
    private String address;
    private String role;

    @PrePersist
    public void generateUserId() {
        if (this.userId == null) {
            this.userId = generateRandomNumericId(10); // 10 chữ số
        }
    }

    private String generateRandomNumericId(int length) {
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10)); // số từ 0-9
        }
        return sb.toString();
    }
}
