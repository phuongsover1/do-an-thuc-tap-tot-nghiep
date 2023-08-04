package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.dto.AccountDTO;
import com.thuctap.fastfood.entities.Account;
import com.thuctap.fastfood.entities.Role;
import com.thuctap.fastfood.entities.Staff;
import com.thuctap.fastfood.entities.User;
import com.thuctap.fastfood.services.AccountService;
import com.thuctap.fastfood.services.RoleService;
import com.thuctap.fastfood.services.StaffService;
import com.thuctap.fastfood.services.UserService;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserService userService;
  private final AccountService accountService;
  private final RoleService roleService;
  private final StaffService staffService;

  @GetMapping("/role")
  public ResponseEntity<Role> getRoleOfAccount(@RequestParam Integer accountId) {
    Optional<Account> accountOptional = accountService.findById(accountId);
    return accountOptional
        .map(account -> ResponseEntity.ok(account.getRole()))
        .orElseGet(() -> ResponseEntity.ok(null));
  }

  @PostMapping("/login")
  public ResponseEntity<AccountDTO> login(@NonNull @RequestBody AccountDTO account) {
    Optional<Account> accountOptional = accountService.findByUsername(account.getUsername());
    if (accountOptional.isPresent()){
      Account dbAccount = accountOptional.get();
      if (account.getPassword().equals(dbAccount.getPassword())) {
        AccountDTO dto = accountService.toDTO(dbAccount);
        return ResponseEntity.ok(dto);
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
  public ResponseEntity<Boolean> checkRegisterRecently(
      @RequestParam("idAccount") Integer idAccount) {
    Optional<Account> accountOptional = accountService.findById(idAccount);
    if (accountOptional.isPresent()) {
      Account returnedAccount = accountOptional.get();
      // TODO: Lỡ account hiện tại là nhân viên hay người dùng
      Role role = returnedAccount.getRole();
      if (role.getName().equals("USER")) {
        Optional<User> returnedUser = userService.findById(returnedAccount.getIdPerson());
        if (returnedUser.isPresent()) {
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

  @PostMapping("/change-password")
  public ResponseEntity<Map<String, String>> changePassword(@RequestBody AccountDTO accountDTO, @RequestParam("newPassword") String newPassword){
    Map<String, String> map = new HashMap<>();
    Optional<Account> accountOptional = accountService.findById(accountDTO.getAccountId());
    if (accountOptional.isPresent()) {
      Account account = accountOptional.get();
      if (!account.getPassword().equals(accountDTO.getPassword())) {
        map.put("error", "Mật khẩu cũ không đúng");
      }else {
        account.setPassword(newPassword);
        String savedPassword = accountService.save(account).getPassword();
        if (!savedPassword.equals(newPassword)) {
          map.put("error", "Thay đổi mật khẩu thất bại");
        }
      }
    }
    return ResponseEntity.ok(map);
  }

  @PostMapping("/change-status")
  public ResponseEntity<Boolean> changeStatus(@RequestParam("accountId") Integer accountId) {
    Optional<Account> accountOptional = accountService.findById(accountId);
    if (accountOptional.isPresent()) {
      Account account = accountOptional.get();
      account.setStatus(!account.isStatus());
      accountService.save(account);
      return ResponseEntity.ok(true);
    }
    return ResponseEntity.ok(false);
  }

  @GetMapping("/check-username-email-phone-number")
  public ResponseEntity<Map<String, String>> checkUsername(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("phoneNumber") String phoneNumber) {
    Map<String, String> map = new HashMap<>();
    Optional<Account> accountOptional = accountService.findByUsername(username);
    if (accountOptional.isPresent()){
      map.put("username", "Username đã tồn tại");
    } else {
      map.put("username", "");
    }

    Optional<User> userOptional = userService.findByEmail(email);
    Optional<Staff> staffOptional = staffService.findByEmail(email);
    if (userOptional.isPresent() || staffOptional.isPresent())  {
      map.put("email", "Email đã tồn tại");
    } else {
      map.put("email", "");
    }
    userOptional = userService.findByPhoneNumber(phoneNumber);
    staffOptional = staffService.findByPhoneNumber(phoneNumber);
    if (userOptional.isPresent() || staffOptional.isPresent())
      map.put("phoneNumber", "Số điện thoại đã tồn tại");
    else map.put("phoneNumber", "");

    return ResponseEntity.ok(map);
  }

}
