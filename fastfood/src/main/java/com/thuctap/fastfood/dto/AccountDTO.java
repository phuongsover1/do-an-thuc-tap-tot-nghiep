package com.thuctap.fastfood.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountDTO {
  private Integer accountId;
  private String username;
  private String password;
  private String email;
  private String phoneNumber;
  private String address;
private Boolean status;
}
