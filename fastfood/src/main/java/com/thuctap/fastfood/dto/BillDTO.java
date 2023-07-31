package com.thuctap.fastfood.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class BillDTO {
  private Integer billId;
  private Integer accountId;
  private List<CartProductDTO> cart;
  private String notes;
  private String address;
  private String phoneNumber;
  private Double totalPrice;
  private String paymentMethod;
  private String status;

}
