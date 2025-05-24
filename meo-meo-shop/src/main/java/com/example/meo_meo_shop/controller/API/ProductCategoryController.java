package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.dto.ProductCategoryDTO;
import com.example.meo_meo_shop.entity.ProductCategory;
import com.example.meo_meo_shop.service.ProductCategoryServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product-categories")
public class ProductCategoryController {

    private final ProductCategoryServiceImpl productCategoryService;

    public ProductCategoryController(ProductCategoryServiceImpl productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @GetMapping
    public ResponseEntity<List<ProductCategoryDTO>> getAllProductCategories() {
        List<ProductCategory> productCategories = productCategoryService.getAll();
        List<ProductCategoryDTO> dtos = productCategories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductCategoryDTO> getProductCategoryById(@PathVariable Long id) {
        Optional<ProductCategory> productCategory = productCategoryService.getById(id);
        return productCategory.map(value -> new ResponseEntity<>(convertToDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<ProductCategoryDTO> createProductCategory(@RequestBody ProductCategory productCategory) {
        if (productCategory == null || productCategory.getProduct() == null || productCategory.getCategory() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        ProductCategory createdProductCategory = productCategoryService.create(productCategory);
        return new ResponseEntity<>(convertToDTO(createdProductCategory), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductCategoryDTO> updateProductCategory(@PathVariable Long id, @RequestBody ProductCategory updatedProductCategory) {
        if (updatedProductCategory == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            ProductCategory updated = productCategoryService.update(id, updatedProductCategory);
            return new ResponseEntity<>(convertToDTO(updated), HttpStatus.OK);
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
    public ResponseEntity<List<ProductCategoryDTO>> getProductCategoriesByProductId(@RequestParam Long productId) {
        if (productId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<ProductCategory> productCategories = productCategoryService.getByProductId(productId);
        List<ProductCategoryDTO> dtos = productCategories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<ProductCategoryDTO>> getProductCategoriesByCategoryId(@RequestParam Long categoryId) {
        if (categoryId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<ProductCategory> productCategories = productCategoryService.getByCategoryId(categoryId);
        List<ProductCategoryDTO> dtos = productCategories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
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

    private ProductCategoryDTO convertToDTO(ProductCategory productCategory) {
        ProductCategoryDTO dto = new ProductCategoryDTO();
        dto.setProductCategoryId(productCategory.getProductCategoryId());

        ProductCategoryDTO.ProductDTO productDTO = new ProductCategoryDTO.ProductDTO();
        productDTO.setProductId(productCategory.getProduct().getProductId());
        productDTO.setName(productCategory.getProduct().getName());
        productDTO.setDescription(productCategory.getProduct().getDescription());
        productDTO.setPrice(productCategory.getProduct().getPrice());
        productDTO.setStock(productCategory.getProduct().getStock());
        productDTO.setImageUrl(productCategory.getProduct().getImageUrl());
        dto.setProduct(productDTO);

        ProductCategoryDTO.CategoryDTO categoryDTO = new ProductCategoryDTO.CategoryDTO();
        categoryDTO.setCategoryId(productCategory.getCategory().getCategoryId());
        categoryDTO.setName(productCategory.getCategory().getName());
        categoryDTO.setDescription(productCategory.getCategory().getDescription());
        dto.setCategory(categoryDTO);

        return dto;
    }
}
