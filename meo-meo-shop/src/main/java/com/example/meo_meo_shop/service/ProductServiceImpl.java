package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Product;
import com.example.meo_meo_shop.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl extends AServiceImpl<Product, Long> implements IService<Product, Long>{
    private final ProductRepository productRepository;
    private static final String IMAGE_UPLOAD_DIR = "backup/images/";

    public ProductServiceImpl(ProductRepository productRepository) {
        super(productRepository);
        this.productRepository = productRepository;
    }

    @Override
    public Product update(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        if (updatedProduct.getName() != null) {
            existing.setName(updatedProduct.getName());
        }
        if (updatedProduct.getDescription() != null) {
            existing.setDescription(updatedProduct.getDescription());
        }
        if (updatedProduct.getPrice() >= 0) {
            existing.setPrice(updatedProduct.getPrice());
        }
        if (updatedProduct.getStock() >= 0) {
            existing.setStock(updatedProduct.getStock());
        }
        if (updatedProduct.getImageUrl() != null) {
            existing.setImageUrl(updatedProduct.getImageUrl());
        }

        return productRepository.save(existing);
    }

    public List<Product> findByNameContaining(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Product saveBase64Image(Long id, String base64Image) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));

        // Giải mã chuỗi base64
        String[] parts = base64Image.split(",");
        String imageData = parts.length > 1 ? parts[1] : parts[0];
        byte[] decodedBytes = Base64.getDecoder().decode(imageData);

        // Tạo tên file duy nhất
        String fileName = UUID.randomUUID().toString();
        String extension = parts.length > 1 && parts[0].contains("image/jpeg") ? ".jpg" : ".png";
        String filePath = IMAGE_UPLOAD_DIR + fileName + extension;

        // Lưu ảnh vào hệ thống tệp
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(decodedBytes);
        }

        // Cập nhật URL ảnh của sản phẩm
        product.setImageUrl(filePath);
        return productRepository.save(product);
    }
}
