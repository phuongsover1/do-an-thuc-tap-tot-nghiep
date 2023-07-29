package com.thuctap.fastfood.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AccountDTO {
    private  String username;
    private  String password;
    private  String email;
    private  String phoneNumber;
    private  String address;
}
