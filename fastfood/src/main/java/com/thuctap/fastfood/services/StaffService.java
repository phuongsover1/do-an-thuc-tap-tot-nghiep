package com.thuctap.fastfood.services;

import com.thuctap.fastfood.entities.Staff;
import com.thuctap.fastfood.repositories.StaffRepository;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Transactional
@Service
public class StaffService {
  private final StaffRepository staffRepository;

  public Optional<Staff> findById(String id) {
    return staffRepository.findById(id);
  }

  public Optional<Staff> findByPhoneNumber(String phoneNumber) {
    return staffRepository.findStaffByPhoneNumber(phoneNumber);
  }

  public Optional<Staff> findByEmail(String email) {

    return staffRepository.findStaffByEmail(email);
  }
}
