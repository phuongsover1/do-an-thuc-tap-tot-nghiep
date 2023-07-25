package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.dto.UserDTO;
import com.thuctap.fastfood.entities.Account;
import com.thuctap.fastfood.entities.User;
import com.thuctap.fastfood.services.AccountService;
import com.thuctap.fastfood.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@CrossOrigin(
        origins = "http://localhost:5173",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
        allowedHeaders = "*",
        allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final AccountService accountService;
    private final UserService userService;

    @PostMapping("/updateInformation")
    public ResponseEntity<Boolean> updateInformation(@RequestBody Map<String, Object> map) {
        try {
            Integer idAccount = (Integer) map.get("idAccount");
            LinkedHashMap<String, String> linkedHashMapUserInfo = (LinkedHashMap<String, String>)  map.get("userInfo");
            UserDTO userDTO = new UserDTO();
            if (linkedHashMapUserInfo.containsKey("lastName"))
                userDTO.setLastName(linkedHashMapUserInfo.get("lastName"));
            if(linkedHashMapUserInfo.containsKey("firstName"))
                userDTO.setFirstName(linkedHashMapUserInfo.get("firstName"));
            if(linkedHashMapUserInfo.containsKey("dateOfBirth"))
                userDTO.setDateOfBirth(LocalDate.parse(linkedHashMapUserInfo.get("dateOfBirth")));
            if(linkedHashMapUserInfo.containsKey("sex")) {
                String sex = linkedHashMapUserInfo.get("sex");
                userDTO.setSex(sex);
            }
            if(linkedHashMapUserInfo.containsKey("address"))
                userDTO.setAddress(linkedHashMapUserInfo.get("address"));
            if(linkedHashMapUserInfo.containsKey("email"))
                userDTO.setEmail(linkedHashMapUserInfo.get("email"));
            if(linkedHashMapUserInfo.containsKey("phoneNumber"))
                userDTO.setPhoneNumber(linkedHashMapUserInfo.get("phoneNumber"));
            Optional<Account> accountOptional = accountService.findById(idAccount);
            if (accountOptional.isPresent()) {
                Account account = accountOptional.get();
                Optional<User> userOptional = userService.findById(account.getIdPerson());
                userOptional.ifPresent(user -> {
                    if (userDTO.getFirstName() != null)
                        user.setFirstName(userDTO.getFirstName());

                    if (userDTO.getLastName() != null)
                        user.setLastName(userDTO.getLastName());
                    if (userDTO.getSex() != null) {
                        user.setSex(userDTO.getSex().equals("1"));
                    }
                    if (userDTO.getDateOfBirth() != null)
                        user.setDateOfBirth(userDTO.getDateOfBirth());
                    if (userDTO.getAddress() != null)
                        user.setAddress(userDTO.getAddress());
                    if (userDTO.getEmail() != null)
                        user.setEmail(userDTO.getEmail());
                    if (userDTO.getPhoneNumber() != null)
                        user.setPhoneNumber(userDTO.getPhoneNumber());
                    userService.save(user);
                });
            }
        } catch (Exception ex) {
            return  ResponseEntity.ok(false);
        }
        return ResponseEntity.ok(true);
    }
}