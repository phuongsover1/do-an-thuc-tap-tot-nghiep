package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.dto.BillDTO;
import com.thuctap.fastfood.entities.*;
import com.thuctap.fastfood.services.*;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/bills")
public class BillController {
  private final BillService billService;
  private final AccountService accountService;
  private final ProductService productService;
  private final UserService userService;
  private final CartService cartService;

  @GetMapping("/{billId}")
  public ResponseEntity<BillDTO> findBillById(@PathVariable Integer billId) {
    Optional<Bill> billOptional = billService.findById(billId);
    BillDTO billDTO = null;
    if (billOptional.isPresent()) {
      Bill bill = billOptional.get();
      billDTO =
          BillDTO.builder()
              .billId(bill.getId())
              .paymentMethod(bill.getPaymentMethod())
              .status(bill.getStatus())
              .totalPrice(bill.getTotalPrice())
              .build();
    }

    return ResponseEntity.ok(billDTO);
  }

  @GetMapping("/paid/{billId}")
  public ResponseEntity<Boolean> successfullyPaid(@PathVariable Integer billId) {
    Optional<Bill> billOptional = billService.findById(billId);
    if (billOptional.isPresent()) {
      Bill bill = billOptional.get();
      bill.setStatus("Đã Thanh Toán");
      bill.setDateSuccessfullyPaid(LocalDateTime.now());
      billService.save(bill);
      return ResponseEntity.ok(true);
    }
    return ResponseEntity.ok(false);
  }

  @PostMapping("/cancel")
  public ResponseEntity<Boolean> cancelBill(@RequestParam("billId") Integer billId) {
    Optional<Bill> billOptional = billService.findById(billId);
    if (billOptional.isPresent()) {
      Bill bill = billOptional.get();
      bill.getBillDetails()
          .forEach(
              billDetail -> {
                Product product = billDetail.getProduct();
                product.setStock(product.getStock() + billDetail.getQuantity());
                productService.saveProduct(product);
              });
      bill.setStatus("Đã Hủy");
      billService.save(bill);
      return ResponseEntity.ok(true);
    }
    return ResponseEntity.ok(false);
  }

  @PostMapping
  public ResponseEntity<Integer> createBill(@RequestBody BillDTO billDTO) {
    Bill bill = createBillFromDTO(billDTO);

    Optional<Account> accountOptional = accountService.findById(billDTO.getAccountId());
    if (accountOptional.isPresent()) {
      Account account = accountOptional.get();
      Cart cart = account.getCart();
      cartService.clearCartProduct(cart);
      cart.clearCart();
      cartService.save(cart);
    }
    bill = billService.save(bill);

    return ResponseEntity.ok(bill.getId());
  }

  private Bill createBillFromDTO(BillDTO billDTO) {
    Bill bill = new Bill();
    Optional<Account> accountOptional = accountService.findById(billDTO.getAccountId());
    if (accountOptional.isPresent()) {
      Account account = accountOptional.get();
      Optional<User> userOptional = userService.findById(account.getIdPerson());
      if (userOptional.isPresent()) {
        User user = userOptional.get();
        bill.setUser(user);
        bill.setStatus("Chờ Thanh Toán");
        bill.setDateCreated(LocalDateTime.now());
        bill.setAddress(billDTO.getAddress());
        bill.setPhoneNumber(billDTO.getPhoneNumber());
        bill.setNotes(billDTO.getNotes());
        bill.setPaymentMethod(billDTO.getPaymentMethod());
        bill.setTotalPrice(billDTO.getTotalPrice());

        // nhét bill detail vào bill
        billDTO
            .getCart()
            .forEach(
                cartProductDTO -> {
                  Optional<Product> productOptional =
                      productService.findById(cartProductDTO.getProductId());
                  if (productOptional.isPresent()) {
                    Product product = productOptional.get();
                    product.setStock(product.getStock() - cartProductDTO.getQuantity());

                    // Lập chi tiết bill
                    BillDetail billDetail = new BillDetail();
                    billDetail.setBill(bill);
                    billDetail.setProduct(product);
                    billDetail.setQuantity(cartProductDTO.getQuantity());
                    billDetail.setPrice(product.getPrice());

                    // Thêm chi tiết vào bill
                    bill.addBillDetail(billDetail);

                    // Lưu số lượng tồn mới vào product
                    productService.saveProduct(product);
                  }
                });
      }
    }
    return bill;
  }
}
