package com.thuctap.fastfood.repositories;

import com.thuctap.fastfood.entities.CartProduct;
import com.thuctap.fastfood.entities.embeddedId.CartProductKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartProductRepository extends JpaRepository<CartProduct, CartProductKey> {
}
