package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.dto.ImageUploadDTO;
import com.example.meo_meo_shop.dto.ProductDTO;
import com.example.meo_meo_shop.entity.Product;
import com.example.meo_meo_shop.service.ProductServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductServiceImpl productService;

    public ProductController(ProductServiceImpl productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<Product> products = productService.getAll();
        List<ProductDTO> dtos = products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getById(id);
        return product.map(value -> new ResponseEntity<>(convertToDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody Product product) {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (product == null || product.getName() == null || product.getName().trim().isEmpty() ||
                product.getPrice() < 0 || product.getStock() < 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Product createdProduct = productService.create(product);
        return new ResponseEntity<>(convertToDTO(createdProduct), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (updatedProduct == null || (updatedProduct.getName() != null && updatedProduct.getName().trim().isEmpty()) ||
                (updatedProduct.getPrice() < 0) ||
                (updatedProduct.getStock() < 0)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            Product updated = productService.update(id, updatedProduct);
            return new ResponseEntity<>(convertToDTO(updated), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productService.getById(id);
        if (product.isPresent()) {
            productService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> findProductsByName(@RequestParam String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<Product> products = productService.findByNameContaining(keyword);
        List<ProductDTO> dtos = products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id, @Valid @RequestBody ImageUploadDTO imageDTO) {
        try {
            Product updatedProduct = productService.saveBase64Image(id, imageDTO.getBase64Image(), imageDTO.getFileName());
            return new ResponseEntity<>(convertToDTO(updatedProduct), HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>("Product not found with ID: " + id, HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to save image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImageUrl());

        // Convert categories
        if (product.getProductCategories() != null) {
            List<ProductDTO.CategoryDTO> categoryDTOs = product.getProductCategories().stream()
                    .map(pc -> {
                        ProductDTO.CategoryDTO categoryDTO = new ProductDTO.CategoryDTO();
                        categoryDTO.setCategoryId(pc.getCategory().getCategoryId());
                        categoryDTO.setName(pc.getCategory().getName());
                        categoryDTO.setDescription(pc.getCategory().getDescription());
                        return categoryDTO;
                    })
                    .collect(Collectors.toList());
            dto.setCategories(categoryDTOs);
        }

        return dto;
    }
}
