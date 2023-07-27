package com.thuctap.fastfood.services;

import com.thuctap.fastfood.entities.Cart;
import com.thuctap.fastfood.entities.CartProduct;
import com.thuctap.fastfood.entities.embeddedId.CartProductKey;
import com.thuctap.fastfood.repositories.CartProductRepository;
import com.thuctap.fastfood.repositories.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartProductRepository cartProductRepository;


    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    public void saveProductToCart(CartProduct cartProduct) {
        cartProductRepository.save(cartProduct);
    }

}
