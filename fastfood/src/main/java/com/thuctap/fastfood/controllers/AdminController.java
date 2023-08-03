package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.dto.StaffDTO;
import com.thuctap.fastfood.services.StaffService;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admins")
public class AdminController {
  private final StaffService staffService;

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
}
