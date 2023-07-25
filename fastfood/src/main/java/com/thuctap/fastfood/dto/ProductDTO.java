package com.thuctap.fastfood.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {
    private String name;
    private Double price;
    private String description;
    private Boolean status;
}
