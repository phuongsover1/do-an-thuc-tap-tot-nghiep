package com.thuctap.fastfood.repositories;

import com.thuctap.fastfood.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}
