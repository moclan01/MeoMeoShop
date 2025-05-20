package com.example.meo_meo_shop.repository;

import com.example.meo_meo_shop.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
