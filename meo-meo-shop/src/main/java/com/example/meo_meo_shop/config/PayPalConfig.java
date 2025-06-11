package com.example.meo_meo_shop.config;

import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PayPalConfig {

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.secret-key}")
    private String secretKey;

    @Value("${paypal.mode}")
    private String mode;

    @Bean
    public PayPalEnvironment payPalEnvironment() {
        if ("sandbox".equalsIgnoreCase(mode)) {
            return new PayPalEnvironment.Sandbox(clientId, secretKey);
        } else {
            return new PayPalEnvironment.Live(clientId, secretKey);
        }
    }

    @Bean
    public PayPalHttpClient payPalHttpClient() {
        return new PayPalHttpClient(payPalEnvironment());
    }
} 