package com.example.meo_meo_shop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productCategoryId;

    // Khóa ngoại tới Product
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Khóa ngoại tới Category
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
