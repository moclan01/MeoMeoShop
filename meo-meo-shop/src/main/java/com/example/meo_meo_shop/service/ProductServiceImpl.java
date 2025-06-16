package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Product;
import com.example.meo_meo_shop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl extends AServiceImpl<Product, Long> implements IService<Product, Long>{
    private final ProductRepository productRepository;
    @Value("${app.image-upload-dir:backup/images/}")
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
        if (updatedProduct.getImageUrl() != null && updatedProduct.getImageUrl().startsWith("/images/")) {
            existing.setImageUrl(updatedProduct.getImageUrl());
        }

        return productRepository.save(existing);
    }

    public List<Product> findByNameContaining(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Product saveBase64Image(Long id, String base64Image, String fileName) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with ID: " + id));

        // Tạo thư mục nếu chưa tồn tại
        Files.createDirectories(Paths.get(IMAGE_UPLOAD_DIR));

        // Giải mã chuỗi base64
        String[] parts = base64Image.split(",");
        String mimeType = parts.length > 1 ? parts[0] : "";
        String imageData = parts.length > 1 ? parts[1] : parts[0];
        byte[] decodedBytes;
        try {
            decodedBytes = Base64.getDecoder().decode(imageData);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid base64 image data");
        }

        // Kiểm tra định dạng ảnh
        String extension;
        if (mimeType.contains("image/jpeg")) {
            extension = ".jpg";
        } else if (mimeType.contains("image/png")) {
            extension = ".png";
        } else {
            throw new IllegalArgumentException("Unsupported image format");
        }

        // Sử dụng tên file được cung cấp hoặc UUID
        String finalFileName = (fileName != null && !fileName.trim().isEmpty()) ? fileName : UUID.randomUUID().toString();
        String filePath = IMAGE_UPLOAD_DIR + finalFileName + extension;
        String publicUrl = "/images/" + finalFileName + extension;

        // Xóa ảnh cũ nếu có
        String oldImageUrl = product.getImageUrl();
        if (oldImageUrl != null && !oldImageUrl.isEmpty() && oldImageUrl.startsWith("/images/")) {
            String oldFilePath = IMAGE_UPLOAD_DIR + oldImageUrl.substring("/images/".length());
            Files.deleteIfExists(Paths.get(oldFilePath));
        }

        // Lưu ảnh vào hệ thống tệp
        System.out.println("Saving image to: " + Paths.get(filePath).toAbsolutePath()); // Log đường dẫn
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(decodedBytes);
        } catch (IOException e) {
            throw new IOException("Failed to save image to " + filePath, e);
        }

        // Cập nhật URL ảnh của sản phẩm
        product.setImageUrl(publicUrl);
        return productRepository.save(product);
    }
}
