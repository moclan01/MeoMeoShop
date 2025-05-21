package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.entity.Product;
import com.example.meo_meo_shop.service.ProductServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductServiceImpl productService;

    public ProductController(ProductServiceImpl productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getById(id);
        return product.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (product == null || product.getName() == null || product.getName().trim().isEmpty() ||
                product.getPrice() < 0 || product.getStock() < 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Product createdProduct = productService.create(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (updatedProduct == null || (updatedProduct.getName() != null && updatedProduct.getName().trim().isEmpty()) ||
                (updatedProduct.getPrice() < 0) ||
                (updatedProduct.getStock() < 0)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            Product updated = productService.update(id, updatedProduct);
            return new ResponseEntity<>(updated, HttpStatus.OK);
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
    public ResponseEntity<List<Product>> findProductsByName(@RequestParam String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<Product> products = productService.findByNameContaining(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
