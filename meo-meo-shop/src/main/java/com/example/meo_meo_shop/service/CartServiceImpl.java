package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Cart;
import com.example.meo_meo_shop.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartServiceImpl extends AServiceImpl<Cart, Long> implements IService<Cart, Long> {
    private final CartRepository cartRepository;

    public CartServiceImpl(CartRepository cartRepository) {
        super(cartRepository);
        this.cartRepository = cartRepository;
    }

    @Override
    public Cart update(Long id, Cart updatedCart) {
        Cart existing = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + id));

        return cartRepository.save(existing);
    }

    @Override
    public Optional<Cart> getById(Long id) {
        return cartRepository.findById(id);
    }

    // Thêm method để lấy Cart theo User ID
    public Optional<Cart> getByUserId(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be empty");
        }
        return cartRepository.findByUser_UserId(userId);
    }

    @Transactional // Ensure this operation is atomic
    public void clearCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));

        // Clear all items from the cart
        cart.getItems().clear();
        cartRepository.save(cart); // Save the cart with cleared items
    }
}
