package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.entity.ProductCategory;
import com.example.meo_meo_shop.service.ProductCategoryServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-categories")
public class ProductCategoryController {

    private final ProductCategoryServiceImpl productCategoryService;

    public ProductCategoryController(ProductCategoryServiceImpl productCategoryService) {
        this.productCategoryService = productCategoryService;
    }


    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllProductCategories() {
        List<ProductCategory> productCategories = productCategoryService.getAll();
        return new ResponseEntity<>(productCategories, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductCategory> getProductCategoryById(@PathVariable Long id) {
        Optional<ProductCategory> productCategory = productCategoryService.getById(id);
        return productCategory.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @PostMapping
    public ResponseEntity<ProductCategory> createProductCategory(@RequestBody ProductCategory productCategory) {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (productCategory == null || productCategory.getProduct() == null || productCategory.getCategory() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        ProductCategory createdProductCategory = productCategoryService.create(productCategory);
        return new ResponseEntity<>(createdProductCategory, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<ProductCategory> updateProductCategory(@PathVariable Long id, @RequestBody ProductCategory updatedProductCategory) {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (updatedProductCategory == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            ProductCategory updated = productCategoryService.update(id, updatedProductCategory);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductCategory(@PathVariable Long id) {
        Optional<ProductCategory> productCategory = productCategoryService.getById(id);
        if (productCategory.isPresent()) {
            productCategoryService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/by-product")
    public ResponseEntity<List<ProductCategory>> getProductCategoriesByProductId(@RequestParam Long productId) {
        if (productId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<ProductCategory> productCategories = productCategoryService.getByProductId(productId);
        return new ResponseEntity<>(productCategories, HttpStatus.OK);
    }


    @GetMapping("/by-category")
    public ResponseEntity<List<ProductCategory>> getProductCategoriesByCategoryId(@RequestParam Long categoryId) {
        if (categoryId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<ProductCategory> productCategories = productCategoryService.getByCategoryId(categoryId);
        return new ResponseEntity<>(productCategories, HttpStatus.OK);
    }


    @DeleteMapping("/by-product/{productId}")
    public ResponseEntity<Void> deleteProductCategoriesByProductId(@PathVariable Long productId) {
        if (productId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        productCategoryService.deleteByProductId(productId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @DeleteMapping("/by-category/{categoryId}")
    public ResponseEntity<Void> deleteProductCategoriesByCategoryId(@PathVariable Long categoryId) {
        if (categoryId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        productCategoryService.deleteByCategoryId(categoryId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
