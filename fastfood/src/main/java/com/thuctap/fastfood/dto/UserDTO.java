package com.thuctap.fastfood.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private String firstName;
    private String lastName;
    private String sex;
    private String address;
    private LocalDate dateOfBirth;
    private String email;
    private String phoneNumber;
}
