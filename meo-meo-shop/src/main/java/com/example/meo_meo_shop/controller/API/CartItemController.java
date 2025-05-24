package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.dto.CartItemDTO;
import com.example.meo_meo_shop.entity.CartItem;
import com.example.meo_meo_shop.service.CartItemServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {
    private final CartItemServiceImpl cartItemService;

    public CartItemController(CartItemServiceImpl cartItemService) {
        this.cartItemService = cartItemService;
    }

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getAllCartItems() {
        List<CartItem> cartItems = cartItemService.getAll();
        List<CartItemDTO> dtos = cartItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartItemDTO> getCartItemById(@PathVariable Long id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<CartItem> cartItem = cartItemService.getById(id);
        return cartItem.map(value -> new ResponseEntity<>(convertToDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<CartItemDTO> addProductToCart(@RequestParam Long cartId, @RequestParam Long productId, @RequestParam int quantity) {
        try {
            CartItem addedItem = cartItemService.addProductToCart(cartId, productId, quantity);
            return new ResponseEntity<>(convertToDTO(addedItem), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemDTO> updateCartItem(@PathVariable Long id, @RequestBody CartItem updatedCartItem) {
        if (id == null || updatedCartItem == null ||
                (updatedCartItem.getQuantity() != 0 && updatedCartItem.getQuantity() <= 0)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        CartItem updated = cartItemService.update(id, updatedCartItem);
        return new ResponseEntity<>(convertToDTO(updated), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<CartItem> cartItem = cartItemService.getById(id);
        if (cartItem.isPresent()) {
            cartItemService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public CartItemDTO convertToDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setCartItemId(cartItem.getCartItemId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setCartId(cartItem.getCart().getCartId());

        // Tạo ProductSimpleDTO
        CartItemDTO.ProductSimpleDTO productDTO = new CartItemDTO.ProductSimpleDTO();
        productDTO.setProductId(cartItem.getProduct().getProductId());
        productDTO.setName(cartItem.getProduct().getName());
        productDTO.setImageUrl(cartItem.getProduct().getImageUrl());
        productDTO.setPrice(cartItem.getProduct().getPrice());
        dto.setProduct(productDTO);

        return dto;
    }
}
