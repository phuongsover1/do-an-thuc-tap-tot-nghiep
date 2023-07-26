package com.thuctap.fastfood.repositories;

import com.thuctap.fastfood.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
