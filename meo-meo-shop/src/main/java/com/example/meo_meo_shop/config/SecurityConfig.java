package com.example.meo_meo_shop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF cho API
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Áp dụng cấu hình CORS
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)) // Quản lý session
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Cho phép OPTIONS cho CORS preflight
                        
                        // Các API cho phép truy cập công khai
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product-categories/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/forgot-password").permitAll()
                        // API tạo đơn hàng (tạm thời cho phép công khai)
                        .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()
                        // Tạm thời: Cho phép endpoint xóa giỏ hàng (cần xem xét lại bảo mật sau)
                        .requestMatchers(HttpMethod.POST, "/api/carts/*/clear").permitAll()

                        // Các API cho phép truy cập công khai giỏ hàng (tạm thời)
                        .requestMatchers(HttpMethod.GET, "/api/carts/by-user/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/carts/*").permitAll()
                        
                        // Các API cho phép truy cập công khai Cart Items (tạm thời - PUT và DELETE)
                        .requestMatchers(HttpMethod.PUT, "/api/cart-items/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/cart-items/**").permitAll()

                        // Các API yêu cầu xác thực
                        .requestMatchers("/api/carts/**").permitAll()
                        .requestMatchers("/api/cart-items/**").permitAll()
                        .requestMatchers("/api/orders/**").permitAll()
                        .requestMatchers("/api/order-items/**").permitAll()
                        .requestMatchers("/api/users/**").permitAll() // Các endpoint user khác cần xác thực
                        
                        // Các endpoint không nằm trong /api có thể cần cấu hình riêng
                        // .requestMatchers("/**").permitAll() // Ví dụ: cho phép tất cả các path khác nếu cần
                        .anyRequest().permitAll() // Mặc định cho phép tất cả các request khác
                )
                // Bỏ cấu hình formLogin tự động chuyển hướng
                // .formLogin(...) 
                .logout(logout -> logout.permitAll());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Cho phép nguồn gốc frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")); // Cho phép các phương thức cần thiết
        configuration.setAllowedHeaders(List.of("*")); // Cho phép tất cả các header
        configuration.setAllowCredentials(true); // Cho phép gửi thông tin xác thực (cookies)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng cho tất cả các đường dẫn
        return source;
    }
}
