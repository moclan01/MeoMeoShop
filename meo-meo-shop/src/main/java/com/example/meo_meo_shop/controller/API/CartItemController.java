package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.entity.CartItem;
import com.example.meo_meo_shop.service.CartItemServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {
    private final CartItemServiceImpl cartItemService;

    public CartItemController(CartItemServiceImpl cartItemService) {
        this.cartItemService = cartItemService;
    }


    @GetMapping
    public ResponseEntity<List<CartItem>> getAllCartItems() {
        List<CartItem> cartItems = cartItemService.getAll();
        return new ResponseEntity<>(cartItems, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartItem> getCartItemById(@PathVariable Long id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<CartItem> cartItem = cartItemService.getById(id);
        return cartItem.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @PostMapping
    public ResponseEntity<CartItem> createCartItem(@RequestBody CartItem cartItem) {
        // Kiểm tra dữ liệu đầu vào
        if (cartItem == null || cartItem.getCart() == null || cartItem.getProduct() == null ||
                cartItem.getQuantity() <= 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        CartItem createdCartItem = cartItemService.create(cartItem);
        return new ResponseEntity<>(createdCartItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long id, @RequestBody CartItem updatedCartItem) {
        // Kiểm tra dữ liệu đầu vào
        if (id == null || updatedCartItem == null ||
                (updatedCartItem.getQuantity() != 0 && updatedCartItem.getQuantity() <= 0)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        CartItem updated = cartItemService.update(id, updatedCartItem);
        return new ResponseEntity<>(updated, HttpStatus.OK);
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
}
