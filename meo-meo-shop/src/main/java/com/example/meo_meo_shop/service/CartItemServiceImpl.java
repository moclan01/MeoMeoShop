package com.example.meo_meo_shop.service;

import com.example.meo_meo_shop.entity.Cart;
import com.example.meo_meo_shop.entity.CartItem;
import com.example.meo_meo_shop.entity.Product;
import com.example.meo_meo_shop.repository.CartItemRepository;
import com.example.meo_meo_shop.repository.CartRepository;
import com.example.meo_meo_shop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartItemServiceImpl extends AServiceImpl<CartItem, Long> implements IService<CartItem, Long> {
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartItemServiceImpl(CartItemRepository cartItemRepository, CartRepository cartRepository, ProductRepository productRepository) {
        super(cartItemRepository);
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
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

    @Transactional
    public CartItem addProductToCart(Long cartId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
            cartRepository.save(cart);
            return newItem;
        }
    }
}
