package com.example.meo_meo_shop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String name;
    private String description;
    private double price;
    private int stock;
    private String imageUrl;
}
