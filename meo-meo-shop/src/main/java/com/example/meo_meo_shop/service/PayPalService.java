package com.example.meo_meo_shop.service;

import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PayPalService {

    @Autowired
    private PayPalHttpClient payPalHttpClient;

    @Value("${paypal.return-url}")
    private String returnUrl;

    @Value("${paypal.webhook-url}")
    private String webhookUrl;

    public Order createOrder(
            Double total,
            String currency,
            String description)
            throws IOException {

        // Build the request body for creating an order
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.checkoutPaymentIntent("CAPTURE"); // Or "AUTHORIZE"

        AmountWithBreakdown amountBreakdown = new AmountWithBreakdown()
                .currencyCode(currency)
                .value(String.format("%.2f", total));

        PurchaseUnitRequest purchaseUnitRequest = new PurchaseUnitRequest()
                .amountWithBreakdown(amountBreakdown)
                .description(description);

        orderRequest.purchaseUnits(new ArrayList<>(List.of(purchaseUnitRequest)));

        ApplicationContext applicationContext = new ApplicationContext()
                .returnUrl(returnUrl)
                .cancelUrl(returnUrl); // Use same return URL for cancel for simplicity

        orderRequest.applicationContext(applicationContext);

        OrdersCreateRequest request = new OrdersCreateRequest().requestBody(orderRequest);
        HttpResponse<Order> response = payPalHttpClient.execute(request);

        return response.result();
    }

    public Order captureOrder(String orderId) throws IOException {
        OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
        HttpResponse<Order> response = payPalHttpClient.execute(request);
        return response.result();
    }

    // You might also want to implement webhook creation/management here if needed
    // public Webhook createWebhook() throws IOException {
    //    Webhook webhook = new Webhook();
    //    webhook.setUrl(webhookUrl);
    //    // Configure webhook events
    //    List<WebhookEventType> eventTypes = new ArrayList<>();
    //    eventTypes.add(new WebhookEventType().eventType("PAYMENT.CAPTURE.COMPLETED"));
    //    webhook.setEventTypes(eventTypes);
    //    WebhooksCreateRequest request = new WebhooksCreateRequest().requestBody(webhook);
    //    HttpResponse<Webhook> response = payPalHttpClient.execute(request);
    //    return response.result();
    // }
} 