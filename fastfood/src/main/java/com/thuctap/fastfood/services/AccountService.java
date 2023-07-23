package com.thuctap.fastfood.services;

import com.thuctap.fastfood.dto.AccountDTO;
import com.thuctap.fastfood.entities.Account;
import com.thuctap.fastfood.entities.Cart;
import com.thuctap.fastfood.entities.User;
import com.thuctap.fastfood.repositories.AccountRepository;
import com.thuctap.fastfood.repositories.CartRepository;
import com.thuctap.fastfood.repositories.RoleRepository;
import com.thuctap.fastfood.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final RoleRepository roleRepository;

    public Account register(AccountDTO accountDTO) {
        User newUser = new User();
        Account newAccount = new Account();
        Cart newCart = new Cart();
        newUser.setEmail(accountDTO.getEmail());
        newUser.setPhoneNumber(accountDTO.getPhoneNumber());
        newAccount.setUsername(accountDTO.getUsername());
        newAccount.setPassword(accountDTO.getPassword());
        newAccount.setCart(newCart);
        cartRepository.save(newCart);
        User returnedUser =  userRepository.save(newUser);
        newAccount.setIdPerson(returnedUser.getId());
        newAccount.setRole(roleRepository.findById(3).get());

        return accountRepository.save(newAccount);
    }
}