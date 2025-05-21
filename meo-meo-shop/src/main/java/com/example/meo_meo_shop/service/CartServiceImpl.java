package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Cart;
import com.example.meo_meo_shop.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartServiceImpl extends AServiceImpl<Cart, Long> implements IService<Cart, Long> {
    private final CartRepository cartRepository;

    public CartServiceImpl(CartRepository cartRepository) {
        super(cartRepository); // truyền đúng kiểu JpaRepository<Cart, Long>
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
}
