package com.thuctap.fastfood.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AccountDTO {
    private final String username;
    private final String password;
    private final String email;
    private final String phoneNumber;
}
