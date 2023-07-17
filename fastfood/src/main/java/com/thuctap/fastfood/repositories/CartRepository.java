package com.thuctap.fastfood.repositories;

import com.thuctap.fastfood.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {}
