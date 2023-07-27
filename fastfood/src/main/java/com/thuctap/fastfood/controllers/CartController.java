package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.dto.SaveProductToCartDTO;
import com.thuctap.fastfood.entities.Account;
import com.thuctap.fastfood.entities.Cart;
import com.thuctap.fastfood.entities.CartProduct;
import com.thuctap.fastfood.entities.Product;
import com.thuctap.fastfood.entities.embeddedId.CartProductKey;
import com.thuctap.fastfood.services.AccountService;
import com.thuctap.fastfood.services.CartService;
import com.thuctap.fastfood.services.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final AccountService accountService;
    private final ProductService productService;
    private final CartService cartService;
//    @GetMapping
//    public ResponseEntity<Set<CartProduct>> getCartProduct(@RequestBody Integer accountId) {
//
//    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveProductToCart(@RequestBody SaveProductToCartDTO body) {
        Map<String, Object> returnedMap = new HashMap<>();
        if (body.getAccountId() != null){
            Optional<Account> accountOptional = accountService.findById(body.getAccountId());
            if (accountOptional.isPresent()) {
                Account account = accountOptional.get();
                Cart cart = account.getCart();
                body.getCartProductDTOS().forEach(cartProductDTO -> {
                    Optional<Product> productOptional = productService.findById(cartProductDTO.getProductId());
                    productOptional.ifPresent(product -> {

                        CartProduct cartProduct = new CartProduct();
                        cartProduct.setCart(cart);
                        cartProduct.setProduct(product);
                        cartProduct.setQuantity(cartProductDTO.getQuantity());
                        cartService.saveProductToCart(cartProduct);
                    });

                });
                returnedMap.put("isSuccessful", true);
                return ResponseEntity.ok(returnedMap);
            }
        }
        returnedMap.put("error", "Cần truyền vào id của tài khoản");
        return ResponseEntity.ok(returnedMap);
    }
}
