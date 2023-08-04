package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.dto.StaffDTO;
import com.thuctap.fastfood.entities.Account;
import com.thuctap.fastfood.entities.Staff;
import com.thuctap.fastfood.services.AccountService;
import com.thuctap.fastfood.services.StaffService;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admins")
public class AdminController {
  private final StaffService staffService;
  private final AccountService accountService;

  @GetMapping("/staffs")
  public ResponseEntity<List<StaffDTO>> findAllStaff(@RequestParam("isWorking") Boolean isWorking) {
    List<StaffDTO> staffDTOS = new ArrayList<>();
    if (isWorking) {
      staffService
          .findAllIsWorking()
          .forEach(
              staff -> {
                StaffDTO dto = staffService.toDTO(staff);
                staffDTOS.add(dto);
              });

    } else {
      staffService
          .findAllNotWorking()
          .forEach(
              staff -> {
                StaffDTO dto = staffService.toDTO(staff);
                staffDTOS.add(dto);
              });
    }
    return ResponseEntity.ok(staffDTOS);
  }

  @PostMapping("/change-staff-status")
  public ResponseEntity<Boolean> quit(@RequestParam("staffId") String staffId) {
    Optional<Staff> staffOptional = staffService.findById(staffId);
    if (staffOptional.isPresent()) {
      Staff staff = staffOptional.get();
      staff.setWorking(!staff.isWorking());
      Account account = accountService.findByIdPerson(staff.getId()).get();
      account.setStatus(!account.isStatus());

      staffService.save(staff);
      accountService.save(account);
      return ResponseEntity.ok(true);
    }
    return ResponseEntity.ok(false);
  }
}
