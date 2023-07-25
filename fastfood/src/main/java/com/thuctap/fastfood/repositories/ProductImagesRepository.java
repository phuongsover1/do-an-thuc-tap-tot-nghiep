package com.thuctap.fastfood.repositories;

import com.thuctap.fastfood.entities.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImagesRepository extends JpaRepository<ProductImage, Integer> {
}
