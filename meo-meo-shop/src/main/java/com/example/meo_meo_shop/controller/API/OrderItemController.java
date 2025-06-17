package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.dto.OrderItemDTO;
import com.example.meo_meo_shop.dto.OrderItemDTO.ProductSimpleDTO;
import com.example.meo_meo_shop.entity.OrderItem;
import com.example.meo_meo_shop.entity.Product;
import com.example.meo_meo_shop.service.OrderItemServiceImpl;
import com.example.meo_meo_shop.service.ProductServiceImpl;
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
    private final ProductServiceImpl productService;

    public OrderItemController(OrderItemServiceImpl orderItemService, ProductServiceImpl productService) {
        this.orderItemService = orderItemService;
        this.productService = productService;
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
    public ResponseEntity<OrderItemDTO> createOrderItem(@RequestBody OrderItemDTO orderItemDTO) {
        try {
            // Get product
            Product product = productService.getById(orderItemDTO.getProduct().getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(orderItemDTO.getQuantity());
            orderItem.setPricePerUnit(product.getPrice());
            orderItem.setOrder(orderItemService.getOrderService().getById(orderItemDTO.getOrder().getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found")));

            OrderItem createdOrderItem = orderItemService.create(orderItem);
            return new ResponseEntity<>(convertToDTO(createdOrderItem), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
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

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItemDTO>> getOrderItemsByOrderId(@PathVariable Long orderId) {
        try {
            // Kiểm tra order có tồn tại
            orderItemService.getOrderService().getById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

            List<OrderItem> orderItems = orderItemService.getOrderItemsByOrderId(orderId);
            List<OrderItemDTO> itemDTOs = orderItems.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(itemDTOs, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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

        // Populate the order field in OrderItemDTO
        if (orderItem.getOrder() != null) {
            OrderItemDTO.OrderSimpleDTO orderDTO = new OrderItemDTO.OrderSimpleDTO();
            orderDTO.setOrderId(orderItem.getOrder().getOrderId());
            dto.setOrder(orderDTO);
        }

        return dto;
    }
}
