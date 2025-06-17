package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.OrderItem;
import com.example.meo_meo_shop.repository.OrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemServiceImpl extends AServiceImpl<OrderItem, Long> implements IService<OrderItem, Long>{
    private final OrderItemRepository orderItemRepository;
    private final OrderServiceImpl orderService;

    public OrderItemServiceImpl(OrderItemRepository orderItemRepository, OrderServiceImpl orderService) {
        super(orderItemRepository);
        this.orderItemRepository = orderItemRepository;
        this.orderService = orderService;
    }

    public OrderServiceImpl getOrderService() {
        return orderService;
    }

    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderOrderId(orderId);
    }
    @Override
    public OrderItem update(Long id, OrderItem updatedOrderItem) {
        OrderItem existing = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with ID: " + id));

        if (updatedOrderItem.getQuantity() > 0) {
            existing.setQuantity(updatedOrderItem.getQuantity());
        }
        if (updatedOrderItem.getPricePerUnit() >= 0) {
            existing.setPricePerUnit(updatedOrderItem.getPricePerUnit());
        }
        if (updatedOrderItem.getOrder() != null) {
            existing.setOrder(updatedOrderItem.getOrder());
        }
        if (updatedOrderItem.getProduct() != null) {
            existing.setProduct(updatedOrderItem.getProduct());
        }

        return orderItemRepository.save(existing);
    }
}
