package com.example.meo_meo_shop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String relativePath = "backup/images/";
        String absolutePath = Paths.get(relativePath).toAbsolutePath().toString().replace("\\", "/") + "/";
        System.out.println("Serving images from: " + absolutePath); // Log đường dẫn
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + absolutePath);
    }
}
