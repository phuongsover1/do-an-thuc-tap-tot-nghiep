package com.thuctap.fastfood.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
  private LocalDateTime dateCreated;
}
