package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.entity.Order;
import com.example.meo_meo_shop.repository.OrderRepository;
import com.example.meo_meo_shop.service.PayPalService;
import com.paypal.orders.LinkDescription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/paypal")
@CrossOrigin(origins = "*")
public class PayPalController {

    private static final Logger logger = LoggerFactory.getLogger(PayPalController.class);

    @Autowired
    private PayPalService payPalService;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> request) {
        try {
            Double total = Double.valueOf(request.get("total").toString());
            String currency = (String) request.get("currency");
            String description = (String) request.get("description");
            Long internalOrderId = Long.valueOf(request.get("orderId").toString()); // Get internal order ID

            com.paypal.orders.Order paypalOrder = payPalService.createOrder(
                    total,
                    currency,
                    description);

            // Associate PayPal Order ID with your internal order
            Optional<Order> optionalInternalOrder = orderRepository.findById(internalOrderId);
            if (optionalInternalOrder.isPresent()) {
                Order internalOrder = optionalInternalOrder.get();
                internalOrder.setPaypalOrderId(paypalOrder.id());
                orderRepository.save(internalOrder);
                logger.info("Associated PayPal Order ID {} with internal Order ID {}", paypalOrder.id(), internalOrderId);
            } else {
                logger.warn("Internal order with ID {} not found when creating PayPal payment.", internalOrderId);
            }

            for (LinkDescription link : paypalOrder.links()) {
                if (link.rel().equals("approve")) {
                    Map<String, String> response = new HashMap<>();
                    response.put("approvalUrl", link.href());
                    response.put("orderId", paypalOrder.id()); // Store orderId to execute later

                    return ResponseEntity.ok(response);
                }
            }
            return ResponseEntity.badRequest().body("Could not get approval URL");

        } catch (IOException e) {
            logger.error("Error creating PayPal payment: ", e);
            return ResponseEntity.internalServerError().body("Error creating PayPal payment: " + e.getMessage());
        } catch (Exception e) {
            logger.error("An unexpected error occurred: ", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/execute-payment")
    public ResponseEntity<?> executePayment(@RequestBody Map<String, String> request) {
        try {
            String paypalOrderId = request.get("orderId");
            
            // Kiểm tra trạng thái đơn hàng nội bộ trước
            Optional<Order> optionalInternalOrder = orderRepository.findByPaypalOrderId(paypalOrderId);
            if (optionalInternalOrder.isPresent()) {
                Order internalOrder = optionalInternalOrder.get();
                if ("COMPLETED".equals(internalOrder.getStatus())) {
                    logger.info("Internal order with PayPal ID {} is already COMPLETED. Skipping PayPal capture.", paypalOrderId);
                    Map<String, String> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("message", "PayPal payment already completed.");
                    return ResponseEntity.ok(response);
                }
            }

            com.paypal.orders.Order paypalOrder = payPalService.captureOrder(paypalOrderId);

            if (paypalOrder.status().equals("COMPLETED")) {
                logger.info("PayPal payment for order ID {} completed successfully.", paypalOrderId);
                if (optionalInternalOrder.isPresent()) { // Sử dụng lại optionalInternalOrder đã tìm kiếm
                    Order internalOrder = optionalInternalOrder.get();
                    internalOrder.setStatus("COMPLETED");
                    orderRepository.save(internalOrder);
                    logger.info("Internal order status updated to COMPLETED for PayPal Order ID: {}", paypalOrderId);
                } else {
                    logger.warn("Internal order not found for PayPal Order ID: {}. Creating a new one or handling as needed.", paypalOrderId);
                    // Tùy chọn: Xử lý trường hợp không tìm thấy đơn hàng nội bộ,
                    // có thể là tạo một đơn hàng mới hoặc đánh dấu là lỗi nếu không mong đợi.
                    // Hiện tại, log cảnh báo và vẫn trả về thành công vì PayPal đã xử lý.
                }

                Map<String, String> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "PayPal payment completed.");
                return ResponseEntity.ok(response);
            } else {
                logger.warn("PayPal payment for order ID {} not completed. Status: {}", paypalOrderId, paypalOrder.status());
                Map<String, String> response = new HashMap<>();
                response.put("status", "failed");
                response.put("message", "PayPal payment not completed. Status: " + paypalOrder.status());
                return ResponseEntity.ok(response);
            }

        } catch (IOException e) {
            logger.error("Error executing PayPal payment: ", e);
            return ResponseEntity.internalServerError().body("Error executing PayPal payment: " + e.getMessage());
        } catch (Exception e) {
            logger.error("An unexpected error occurred: ", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred: " + e.getMessage());
        }
    }

    // You might also need a webhook endpoint here if you implement webhooks
    // @PostMapping("/webhook")
    // public ResponseEntity<?> handleWebhook(@RequestBody String payload, @RequestHeader("paypal-transmission-id") String transmissionId) {
    //     // Implement webhook verification and processing here
    //     return ResponseEntity.ok().build();
    // }
} 