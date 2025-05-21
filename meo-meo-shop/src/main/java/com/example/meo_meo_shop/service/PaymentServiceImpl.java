package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Payment;
import com.example.meo_meo_shop.repository.PaymentRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl extends AServiceImpl<Payment, Long> implements IService<Payment, Long>{
    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        super(paymentRepository);
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment update(Long id, Payment updatedPayment) {
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));

        if (updatedPayment.getPaymentMethod() != null) {
            existing.setPaymentMethod(updatedPayment.getPaymentMethod());
        }
        if (updatedPayment.getAmount() >= 0) {
            existing.setAmount(updatedPayment.getAmount());
        }
        if (updatedPayment.getStatus() != null) {
            existing.setStatus(updatedPayment.getStatus());
        }
        if (updatedPayment.getOrder() != null) {
            existing.setOrder(updatedPayment.getOrder());
        }

        return paymentRepository.save(existing);
    }
}
