package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.entities.Account;
import com.thuctap.fastfood.repositories.AccountRepository;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@CrossOrigin(
    origins = "http://localhost:5173",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowedHeaders = "*",
    allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {
  private final AccountRepository accountRepository;

  @GetMapping("/checkUsername")
  public ResponseEntity<Object> checkUsername(@RequestParam("username") String username) {
    HttpHeaders responseHeaders = new HttpHeaders();
    responseHeaders.set("Content-type", "application/json");
    return ResponseEntity.ok().headers(responseHeaders).body(new Integer(3));
  }

  @PostMapping("/login")
  public ResponseEntity<Integer> login(@NonNull @RequestBody Account account) {
    Optional<Account> accountOptional = accountRepository.findByUsername(account.getUsername());
    if (accountOptional.isPresent()) {
      Account dbAccount = accountOptional.get();
      if (account.getPassword().equals(dbAccount.getPassword())) {
        return ResponseEntity.ok().body(dbAccount.getId());
      }
    }
    return ResponseEntity.ok().body(null);
  }

  @PostMapping("/testPost")
  public ResponseEntity<Object> testPost() {
    return ResponseEntity.ok().body("Hello");
  }
}
