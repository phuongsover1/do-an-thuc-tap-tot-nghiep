package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.dto.ProductImportDTO;
import com.thuctap.fastfood.entities.*;
import com.thuctap.fastfood.services.*;

import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/staffs")
public class StaffController {
  private final AccountService accountService;
  private final StaffService staffService;
  private final ProductService productService;
  private final ProductImportNoteService productImportNoteService;
  private final BillService billService;
  @PostMapping("/importNote")
  public ResponseEntity<Integer> saveImportNote(@RequestBody ProductImportDTO productImportDTO) {
    Optional<Account> accountOptional = accountService.findById(productImportDTO.getAccountId());
    if (accountOptional.isPresent()) {
      Optional<Staff> staffOptional = staffService.findById(accountOptional.get().getIdPerson());
      if (staffOptional.isPresent()) {
        Staff staff = staffOptional.get();
        Optional<Product> productOptional =
            productService.findById(productImportDTO.getProductId());
        if (productOptional.isPresent()) {
          Product product = productOptional.get();

          // Lập phiếu nhập hàng
          ProductImportNote importNote = new ProductImportNote();
          importNote.setStaff(staff);
          importNote.setDate(LocalDateTime.now());

          // lập chi tiết phiếu nhập hàng
          ProductImportNoteDetails importNoteDetails = new ProductImportNoteDetails();
          importNoteDetails.setImportNote(importNote);
          importNoteDetails.setProduct(product);
          importNoteDetails.setQuantity(productImportDTO.getQuantity());
          importNoteDetails.setPrice(productImportDTO.getPrice());

          // Thêm chi tiết vào đơn
          importNote.addProductImportNoteDetails(importNoteDetails);

          // Lưu Đơn
          ProductImportNote returnImportNote = productImportNoteService.save(importNote);
          return ResponseEntity.ok(returnImportNote.getId());
        }
      }
    }
    return ResponseEntity.ok(null);
  }

  @PostMapping("/payment-confirmation")
  public ResponseEntity<Boolean> paymentConfirmation(@RequestParam("billId") Integer billId, @RequestParam("accountId") Integer accountId) {
    Optional<Bill> billOptional = billService.findById(billId);
    Optional<Account> accountOptional = accountService.findById(accountId);
    if (billOptional.isPresent() && accountOptional.isPresent()) {
      Bill bill = billOptional.get();
      Account account = accountOptional.get();
      Staff staff = staffService.findById(account.getIdPerson()).get();
      bill.setStatus("Đã Thanh Toán");
      bill.setDateSuccessfullyPaid(LocalDateTime.now());
      bill.setStaff(staff);

      // Lập phiếu xuất
      ProductExportNote exportNote = new ProductExportNote();
      exportNote.setDate(LocalDateTime.now());
      exportNote.setBill(bill);

       bill.setExportNote(exportNote);
      exportNote =  billService.save(exportNote);
      bill.setExportNote(exportNote);
      billService.save(bill);
      return ResponseEntity.ok(true);
    }

    return ResponseEntity.ok(false);
  }
}
