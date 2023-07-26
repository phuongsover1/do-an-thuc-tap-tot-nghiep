package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.entities.Product;
import com.thuctap.fastfood.entities.ProductImage;
import com.thuctap.fastfood.services.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@RestController
//@CrossOrigin(
//        origins = "http://localhost:5173",
//        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
//        allowedHeaders = "*",
//        allowCredentials = "true")
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    @PostMapping
    public ResponseEntity<Map<String, Object>> saveProduct(@RequestBody Map<String, Object> body) {
        Map<String, Object> returnedMap = new HashMap<>();
        // add new
        Product product = productService.createProductFromMap(body);
        product = productService.saveProduct(product);
        returnedMap.put("productId", product.getId());
        return ResponseEntity.ok(returnedMap);
    }


    @PostMapping(value = "/uploadImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Boolean> uploadImage(@RequestParam MultipartFile file, @RequestParam("productId") Integer productId) throws IOException {
        ProductImage productImage = new ProductImage();
        productImage.setImage(file.getBytes());
        productImage.setImageName("anh 1");
        Optional<Product> productOptional = productService.findById(productId);
        productOptional.ifPresent(product -> {
            productService.saveImage(productImage,product);
        });
        return ResponseEntity.ok(true);
    }

    @PostMapping(value = "/updateImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Boolean> updateImage(@RequestParam MultipartFile file, @RequestParam("productId") Integer productId) throws IOException {
        Optional<Product> productOptional = productService.findById(productId);
        if(productOptional.isPresent()) {
            Product product = productOptional.get();
            Optional<ProductImage> productImageOptional = productService.findImageByProductAndName(product, "anh 1");
            if (productImageOptional.isPresent()) {
                ProductImage productImage = productImageOptional.get();
                productImage.setImage(file.getBytes());
                productService.saveImage(productImage);
                return ResponseEntity.ok(true);
            }

        }
        return ResponseEntity.ok(false);
    }

    @GetMapping(value = "/image",   produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getImage( @RequestParam Integer productId, @RequestParam String imageName) {
        Optional<Product> productOptional = productService.findById(productId);
        if (productOptional.isPresent()){
            Optional<ProductImage> productImageOptional = productService.findImageByProductAndName(productOptional.get(), imageName);
            if (productImageOptional.isPresent()){
                return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(productImageOptional.get().getImage());
            }
        }
        return null;
    }


    @GetMapping
    public ResponseEntity<List<Product>> findAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }



}
