package com.thuctap.fastfood.repositories;

import com.thuctap.fastfood.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Integer> {}
