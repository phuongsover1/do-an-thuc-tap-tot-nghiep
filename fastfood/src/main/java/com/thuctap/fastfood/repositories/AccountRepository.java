package com.thuctap.fastfood.repositories;

import com.thuctap.fastfood.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Integer> {}
