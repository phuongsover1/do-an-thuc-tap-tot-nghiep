package com.thuctap.fastfood.controllers;

import com.thuctap.fastfood.dto.ProductDTO;
import com.thuctap.fastfood.entities.Category;
import com.thuctap.fastfood.entities.Product;
import com.thuctap.fastfood.entities.ProductImage;
import com.thuctap.fastfood.services.CategoryService;
import com.thuctap.fastfood.services.ProductService;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
  private final ProductService productService;
  private final CategoryService categoryService;

  @PostMapping
  public ResponseEntity<Integer> saveProduct(@RequestBody ProductDTO productDTO) {
    // add new
    Product product = productService.convertProductDTOToProduct(productDTO);
    product.setStock(0);
    product = productService.saveProduct(product);
    return ResponseEntity.ok(product.getId());
  }

  @PostMapping("/update")
  public ResponseEntity<Integer> updateProduct(@RequestBody ProductDTO productDTO) {
    Optional<Product> productOptional = productService.findById(productDTO.getId());
    if (productOptional.isPresent()) {
      Product product = productOptional.get();
      product.setName(productDTO.getName());
      product.setPrice(Double.valueOf(productDTO.getPrice()));
      product.setDescription(productDTO.getDescription());
      product.getCategories().clear();
      for (String idCate : productDTO.getCategories()) {
        Category category = categoryService.findById(Integer.parseInt(idCate)).get();
        product.getCategories().add(category);
      }
      product = productService.saveProduct(product);
      return ResponseEntity.ok(product.getId());
    }
    return ResponseEntity.ok(null);
  }
  @PostMapping("/delete")
  public ResponseEntity<String> deleteProduct(@RequestParam("productId") Integer productId) {
    Optional<Product> productOptional = productService.findById(productId);
    if (productOptional.isPresent()) {
      Product product = productOptional.get();
      if (product.getStock() > 0) {
        return ResponseEntity.ok("Hàng đã được lập phiếu nhập, không thể xóa");
      }

      if (!product.getBillDetails().isEmpty()) {
        return ResponseEntity.ok("Sản phẩm đã có trong hóa đơn, không thể xóa");
      }

      product.getCartProducts().clear();
      product.getCategories().clear();
      product =productService.saveProduct(product);
      productService.deleteProduct(product);
      return ResponseEntity.ok("");
    }
    return ResponseEntity.ok("Mã sản phầm không tồn tại");
  }

  @PostMapping(value = "/uploadImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Boolean> uploadImage(
      @RequestParam MultipartFile file, @RequestParam("productId") Integer productId)
      throws IOException {
    ProductImage productImage = new ProductImage();
    productImage.setImage(file.getBytes());
    productImage.setImageName("anh 1");
    Optional<Product> productOptional = productService.findById(productId);
    productOptional.ifPresent(
        product -> {
          productService.saveImage(productImage, product);
        });
    return ResponseEntity.ok(true);
  }

  @PostMapping(value = "/updateImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Boolean> updateImage(
      @RequestParam MultipartFile file, @RequestParam("productId") Integer productId)
      throws IOException {
    Optional<Product> productOptional = productService.findById(productId);
    if (productOptional.isPresent()) {
      Product product = productOptional.get();
      Optional<ProductImage> productImageOptional =
          productService.findImageByProductAndName(product, "anh 1");
      if (productImageOptional.isPresent()) {
        ProductImage productImage = productImageOptional.get();
        productImage.setImage(file.getBytes());
        productService.saveImage(productImage);
        return ResponseEntity.ok(true);
      }
    }
    return ResponseEntity.ok(false);
  }

  @GetMapping(value = "/image", produces = MediaType.IMAGE_JPEG_VALUE)
  public ResponseEntity<byte[]> getImage(
      @RequestParam Integer productId, @RequestParam String imageName) {
    Optional<Product> productOptional = productService.findById(productId);
    if (productOptional.isPresent()) {
      Optional<ProductImage> productImageOptional =
          productService.findImageByProductAndName(productOptional.get(), imageName);
      if (productImageOptional.isPresent()) {
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_JPEG)
            .body(productImageOptional.get().getImage());
      }
    }
    return null;
  }

  @GetMapping
  public ResponseEntity<List<Product>> findAllProducts() {
    List<Product> products =
        productService.findAll().stream()
            .filter(product -> product.getStatus() && product.getStock() > 0)
            .map(
                product -> {
                  product.setImages(new HashSet<>());
                  return product;
                })
            .collect(Collectors.toList());
    return ResponseEntity.ok(products);
  }

  @GetMapping("/allProducts")
  public ResponseEntity<List<Product>> findAllProductsAdminStaff() {
    List<Product> products =
        productService.findAll().stream()
            .map(
                product -> {
                  product.setImages(new HashSet<>());
                  return product;
                })
            .collect(Collectors.toList());
    return ResponseEntity.ok(products);
  }


  @GetMapping("/{productId}")
  public ResponseEntity<ProductDTO> findById(@PathVariable Integer productId) {
    Optional<Product> productOptional = productService.findById(productId);
    if (productOptional.isPresent()) {
      Product product = productOptional.get();
      ProductDTO productDTO =
          ProductDTO.builder()
              .id(product.getId())
              .name(product.getName())
              .price(String.valueOf(product.getPrice()))
              .description(product.getDescription())
              .categories(
                  product.getCategories().stream()
                      .map(
                          category -> {
                            return String.valueOf(category.getId());
                          })
                      .collect(Collectors.toSet()))
              .build();
      return ResponseEntity.ok(productDTO);
    }
    return ResponseEntity.ok(null);
  }
}
