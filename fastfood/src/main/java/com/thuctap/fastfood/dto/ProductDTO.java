package com.thuctap.fastfood.dto;

import com.thuctap.fastfood.entities.Category;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ProductDTO {
    private String name;
    private Double price;
    private String description;
    private Boolean status;
    private List<String> categoriesId = new ArrayList<>();
}
