package com.thuctap.fastfood.repositories;

import com.thuctap.fastfood.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {}
