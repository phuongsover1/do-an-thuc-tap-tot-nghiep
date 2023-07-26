package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.entities.Category;
import com.thuctap.fastfood.services.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<Boolean> saveCategory(@RequestBody Category  category)   {
        Category returnedCategory = categoryService.save(category);
        if (returnedCategory.getId() != null)
            return ResponseEntity.ok(true);
        return ResponseEntity.ok(false);
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @PatchMapping
    public ResponseEntity<Boolean> updateCategory(@RequestBody Category category){
        Category returnedCategory = categoryService.save(category);
        if (returnedCategory.getDescription().equals(category.getDescription()) && returnedCategory.getName().equals(category.getName())) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }

}
