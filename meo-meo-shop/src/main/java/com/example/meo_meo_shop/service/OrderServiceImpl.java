package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Order;
import com.example.meo_meo_shop.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl extends AServiceImpl<Order, Long> implements IService<Order, Long>{
    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        super(orderRepository);
        this.orderRepository = orderRepository;
    }

    @Override
    public Order update(Long id, Order updatedOrder) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));

        if (updatedOrder.getOrderDate() != null) {
            existing.setOrderDate(updatedOrder.getOrderDate());
        }
        if (updatedOrder.getTotalAmount() >= 0) {
            existing.setTotalAmount(updatedOrder.getTotalAmount());
        }
        if (updatedOrder.getStatus() != null) {
            existing.setStatus(updatedOrder.getStatus());
        }
        if (updatedOrder.getShippingAddress() != null) {
            existing.setShippingAddress(updatedOrder.getShippingAddress());
        }
        if (updatedOrder.getPhone() != null) {
            existing.setPhone(updatedOrder.getPhone());
        }
        if (updatedOrder.getUser() != null) {
            existing.setUser(updatedOrder.getUser());
        }
        if (updatedOrder.getPaymentMethod() != null) {
            existing.setPaymentMethod(updatedOrder.getPaymentMethod());
        }

        return orderRepository.save(existing);
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserUserId(userId);
    }
}
