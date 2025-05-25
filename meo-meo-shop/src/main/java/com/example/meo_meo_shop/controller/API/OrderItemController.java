package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.dto.OrderItemDTO;
import com.example.meo_meo_shop.dto.OrderItemDTO.ProductSimpleDTO;
import com.example.meo_meo_shop.entity.OrderItem;
import com.example.meo_meo_shop.entity.Product;
import com.example.meo_meo_shop.service.OrderItemServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {
    private final OrderItemServiceImpl orderItemService;

    public OrderItemController(OrderItemServiceImpl orderItemService) {
        this.orderItemService = orderItemService;
    }

    @GetMapping
    public ResponseEntity<List<OrderItemDTO>> getAllOrderItems() {
        List<OrderItem> orderItems = orderItemService.getAll();
        List<OrderItemDTO> itemDTOs = orderItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(itemDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItemDTO> getOrderItemById(@PathVariable Long id) {
        Optional<OrderItem> orderItem = orderItemService.getById(id);
        return orderItem.map(this::convertToDTO)
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<OrderItemDTO> createOrderItem(@RequestBody OrderItem orderItem) {
        OrderItem createdOrderItem = orderItemService.create(orderItem);
        return new ResponseEntity<>(convertToDTO(createdOrderItem), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItemDTO> updateOrderItem(@PathVariable Long id, @RequestBody OrderItem updatedOrderItem) {
        try {
            OrderItem updated = orderItemService.update(id, updatedOrderItem);
            return new ResponseEntity<>(convertToDTO(updated), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        orderItemService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private OrderItemDTO convertToDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setOrderItemId(orderItem.getOrderItemId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPricePerUnit(orderItem.getPricePerUnit());

        if (orderItem.getProduct() != null) {
            OrderItemDTO.ProductSimpleDTO productDTO = new OrderItemDTO.ProductSimpleDTO();
            productDTO.setProductId(orderItem.getProduct().getProductId());
            productDTO.setName(orderItem.getProduct().getName());
            productDTO.setImageUrl(orderItem.getProduct().getImageUrl());
            productDTO.setPrice(orderItem.getProduct().getPrice());
            dto.setProduct(productDTO);
        }

        return dto;
    }
}
