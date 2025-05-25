package com.example.meo_meo_shop.controller.API;

import com.example.meo_meo_shop.dto.CartDTO;
import com.example.meo_meo_shop.dto.CartItemDTO;
import com.example.meo_meo_shop.entity.Cart;
import com.example.meo_meo_shop.entity.CartItem;
import com.example.meo_meo_shop.service.CartServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    private final CartServiceImpl cartService;
    private final CartItemController cartItemController;

    public CartController(CartServiceImpl cartService, CartItemController cartItemController) {
        this.cartService = cartService;
        this.cartItemController = cartItemController;
    }

    @GetMapping
    public ResponseEntity<List<CartDTO>> getAllCarts() {
        List<Cart> carts = cartService.getAll();
        List<CartDTO> dtos = carts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartDTO> getCartById(@PathVariable Long id) {
        Optional<Cart> cart = cartService.getById(id);
        return cart.map(value -> new ResponseEntity<>(convertToDTO(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<CartDTO> createCart(@RequestBody Cart cart) {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (cart == null || cart.getUser() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Cart createdCart = cartService.create(cart);
        return new ResponseEntity<>(convertToDTO(createdCart), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartDTO> updateCart(@PathVariable Long id, @RequestBody Cart updatedCart) {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (updatedCart == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            Cart updated = cartService.update(id, updatedCart);
            return new ResponseEntity<>(convertToDTO(updated), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        Optional<Cart> cart = cartService.getById(id);
        if (cart.isPresent()) {
            cartService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{cartId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long cartId) {
        try {
            cartService.clearCart(cartId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            System.err.println("Error clearing cart with ID " + cartId + ": " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<CartDTO> getCartByUserId(@PathVariable String userId) {
        try {
            Optional<Cart> cart = cartService.getByUserId(userId);
            return cart.map(value -> new ResponseEntity<>(convertToDTO(value), HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private CartDTO convertToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setCartId(cart.getCartId());

        // Chuyển đổi User sang UserSimpleDTO
        if (cart.getUser() != null) {
            CartDTO.UserSimpleDTO userDTO = new CartDTO.UserSimpleDTO();
            userDTO.setUserId(cart.getUser().getUserId());
            userDTO.setName(cart.getUser().getName());
            userDTO.setEmail(cart.getUser().getEmail());
            dto.setUser(userDTO);
        }

        // Chuyển đổi CartItems sang CartItemDTOs sử dụng phương thức từ CartItemController
        if (cart.getItems() != null) {
            List<CartItem> orderedItems = cart.getItems().stream()
                    .sorted((a, b) -> a.getCartItemId().compareTo(b.getCartItemId()))
                    .collect(Collectors.toList());
            List<CartItemDTO> itemDTOs = orderedItems.stream()
                    .map(cartItemController::convertToDTO)
                    .collect(Collectors.toList());
            dto.setItems(itemDTOs);
        }

        return dto;
    }
}
