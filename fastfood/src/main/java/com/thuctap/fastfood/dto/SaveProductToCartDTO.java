package com.thuctap.fastfood.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class SaveProductToCartDTO {
    private Integer accountId;
    private List<CartProductDTO> cartProductDTOS;
}
