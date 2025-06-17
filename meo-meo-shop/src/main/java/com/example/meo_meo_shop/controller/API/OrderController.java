package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.dto.OrderDTO;
import com.example.meo_meo_shop.dto.OrderItemDTO;
import com.example.meo_meo_shop.entity.Order;
import com.example.meo_meo_shop.entity.OrderItem;
import com.example.meo_meo_shop.entity.User;
import com.example.meo_meo_shop.entity.Product;
import com.example.meo_meo_shop.service.OrderServiceImpl;
import com.example.meo_meo_shop.service.ProductServiceImpl;
import com.example.meo_meo_shop.service.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderServiceImpl orderService;
    private final UserServiceImpl userService;
    private final ProductServiceImpl productService;

    public OrderController(OrderServiceImpl orderService, UserServiceImpl userService, ProductServiceImpl productService) {
        this.orderService = orderService;
        this.userService = userService;
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<Order> orders = orderService.getAll();
        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(orderDTOs, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getById(id);
        return order.map(this::convertToDTO)
                .map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        try {
            // Get user
            User user = userService.getById(orderDTO.getUser().getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create order
            Order order = new Order();
            order.setUser(user);
            order.setOrderDate(orderDTO.getOrderDate());
            // totalAmount will be calculated after order items are populated

            // Create order items
            java.util.List<OrderItem> orderItems = orderDTO.getOrderItems().stream()
                    .map(itemDTO -> {
                        Product product = productService.getById(itemDTO.getProduct().getProductId())
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                        OrderItem orderItem = new OrderItem();
                        orderItem.setOrder(order);
                        orderItem.setProduct(product);
                        orderItem.setQuantity(itemDTO.getQuantity());
                        orderItem.setPricePerUnit(product.getPrice());

                        return orderItem;
                    })
                    .collect(Collectors.toList());

            // Now calculate totalAmount from the correctly populated orderItems list
            double calculatedTotalAmount = orderItems.stream()
                    .mapToDouble(item -> item.getQuantity() * item.getPricePerUnit())
                    .sum();
            order.setTotalAmount(calculatedTotalAmount);

            order.setStatus(orderDTO.getStatus());
            order.setShippingAddress(orderDTO.getShippingAddress());
            order.setPhone(orderDTO.getPhone());
            order.setPaymentMethod(orderDTO.getPaymentMethod());
            order.setOrderItems(new java.util.HashSet<>(orderItems));
            Order createdOrder = orderService.create(order);
            return new ResponseEntity<>(convertToDTO(createdOrder), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        try {
            Order updated = orderService.update(id, updatedOrder);
            return new ResponseEntity<>(convertToDTO(updated), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable String userId) {
        try {
            // Kiểm tra user có tồn tại
            userService.getById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            List<Order> orders = orderService.getOrdersByUserId(userId);
            List<OrderDTO> orderDTOs = orders.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(orderDTOs, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());

        if (order.getUser() != null) {
            OrderDTO.UserSimpleDTO userDTO = new OrderDTO.UserSimpleDTO();
            userDTO.setUserId(order.getUser().getUserId());
            userDTO.setName(order.getUser().getName());
            userDTO.setEmail(order.getUser().getEmail());
            dto.setUser(userDTO);
        }

        if (order.getOrderItems() != null) {
            List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            dto.setOrderItems(itemDTOs);
        }

        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPhone(order.getPhone());

        return dto;
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
