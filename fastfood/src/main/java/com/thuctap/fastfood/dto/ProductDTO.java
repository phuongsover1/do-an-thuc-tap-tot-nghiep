package com.thuctap.fastfood.dto;

import com.thuctap.fastfood.entities.Category;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class ProductDTO {
    private Integer id;
    private String name;
    private String price;
    private String description;
    private Boolean status;
    private Set<String> categories = new HashSet<>();
}
