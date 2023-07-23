package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.dto.AccountDTO;
import com.thuctap.fastfood.entities.Account;
import com.thuctap.fastfood.entities.Role;
import com.thuctap.fastfood.entities.User;
import com.thuctap.fastfood.repositories.AccountRepository;
import com.thuctap.fastfood.repositories.UserRepository;
import com.thuctap.fastfood.services.AccountService;
import com.thuctap.fastfood.services.RoleService;
import com.thuctap.fastfood.services.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
        allowedHeaders = "*",
        allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final AccountService accountService;
    private final RoleService roleService;

    @PostMapping("/login")
    public ResponseEntity<Integer> login(@NonNull @RequestBody Account account) {
        Optional<Account> accountOptional = accountService.findByUsername(account.getUsername());
        if (accountOptional.isPresent()) {
            Account dbAccount = accountOptional.get();
            if (account.getPassword().equals(dbAccount.getPassword())) {
                return ResponseEntity.ok().body(dbAccount.getId());
            }
        }
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@NonNull @RequestBody AccountDTO accountDTO) {
        Map<String, Object> map = new HashMap<>();
        boolean isValid = true;
        Optional<Account> accountOptional = accountService.findByUsername(accountDTO.getUsername());
        if (accountOptional.isPresent()) {
            map.put("username", "Tên tài khoản đã tồn tại");
            isValid = false;
        }
        Optional<User> userOptional = userService.findByEmail(accountDTO.getEmail());
        if (userOptional.isPresent()) {
            map.put("email", "Email đã tồn tài trên tài khoản khác");
            isValid = false;
        }

        userOptional = userService.findByPhoneNumber(accountDTO.getPhoneNumber());
        if (userOptional.isPresent()) {
            map.put("phoneNumber", "Số điện thoại đã tồn tại trên tài khoản khác");
            isValid = false;
        }

        if (!isValid) {
            map.put("idAccount", null);
        }
        if (isValid) {
            Account registeredAccount = accountService.register(accountDTO);
            map.put("idAccount", registeredAccount.getId());
        }

        return ResponseEntity.ok(map);
    }

    @GetMapping("/checkUserRegisterRecently")
    public ResponseEntity<Boolean> checkRegisterRecently(@RequestParam("idAccount") Integer idAccount) {
        Optional<Account> accountOptional = accountService.findById(idAccount);
        if (accountOptional.isPresent()){
            Account returnedAccount = accountOptional.get();
            // TODO: Lỡ account hiện tại là nhân viên hay người dùng
            Role role = returnedAccount.getRole();
            if (role.getName().equals("USER")) {
                Optional<User> returnedUser = userService.findById(returnedAccount.getIdPerson());
                if (returnedUser.isPresent()){
                    User user = returnedUser.get();
                    if (user.getFirstName() == null) {
                        return ResponseEntity.ok(true);
                    }
                    return ResponseEntity.ok(false);
                }
            } else {
                return ResponseEntity.ok(false);
            }
        }
        return ResponseEntity.ok(false);
    }
}
