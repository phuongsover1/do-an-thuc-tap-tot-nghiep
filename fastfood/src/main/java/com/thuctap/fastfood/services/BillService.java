package com.thuctap.fastfood.services;

import com.thuctap.fastfood.dto.BillDTO;
import com.thuctap.fastfood.entities.Bill;
import com.thuctap.fastfood.repositories.AccountRepository;
import com.thuctap.fastfood.repositories.BillRepository;
import com.thuctap.fastfood.repositories.ProductRepository;
import com.thuctap.fastfood.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RequiredArgsConstructor
@Transactional
@Service
public class BillService {
  private final BillRepository billRepository;

  public Optional<Bill> findById(Integer id) {
    return billRepository.findById(id);
  }

  public Bill save(Bill bill) {
    return billRepository.save(bill);
  }
}
