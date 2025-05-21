package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.CartItem;
import com.example.meo_meo_shop.repository.CartItemRepository;
import org.springframework.stereotype.Service;

@Service
public class CartItemServiceImpl extends AServiceImpl<CartItem, Long> implements IService<CartItem, Long> {
    private final CartItemRepository cartItemRepository;

    public CartItemServiceImpl(CartItemRepository cartItemRepository) {
        super(cartItemRepository);
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public CartItem update(Long id, CartItem updatedCartItem) {
        CartItem existing = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItem not found with ID: " + id));

        if (updatedCartItem.getQuantity() > 0) {
            existing.setQuantity(updatedCartItem.getQuantity());
        }
        if (updatedCartItem.getProduct() != null) {
            existing.setProduct(updatedCartItem.getProduct());
        }
        if (updatedCartItem.getCart() != null) {
            existing.setCart(updatedCartItem.getCart());
        }

        return cartItemRepository.save(existing);
    }
}
