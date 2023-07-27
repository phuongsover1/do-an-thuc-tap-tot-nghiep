package com.thuctap.fastfood.services;

import com.thuctap.fastfood.dto.ProductDTO;
import com.thuctap.fastfood.entities.Category;
import com.thuctap.fastfood.entities.Product;
import com.thuctap.fastfood.entities.ProductImage;
import com.thuctap.fastfood.repositories.CategoryRepository;
import com.thuctap.fastfood.repositories.ProductImagesRepository;
import com.thuctap.fastfood.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductImagesRepository productImagesRepository;
    private final CategoryRepository categoryRepository;

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public void saveImage(ProductImage productImage, Product product){
        product.addImage(productImage);
        productImagesRepository.save(productImage);
        productRepository.save(product);
    }

    public void saveImage(ProductImage productImage){
        productImagesRepository.save(productImage);
    }

    public Optional<Product> findById(Integer id) {
        return productRepository.findById(id);
    }

    public Optional<ProductImage> findImageByProductAndName(Product product, String imageName) {
        return productImagesRepository.findProductImageByProductIdAndImageName(product, imageName);
    }

    public void deleteProduct(Product product) {
        productRepository.delete(product);
    }

    public Product convertProductDTOToProduct(ProductDTO productDTO){
        Product product = new Product();
        if (productDTO.getName() != null)
            product.setName(productDTO.getName());
        if (productDTO.getDescription() != null)
            product.setDescription(productDTO.getDescription());
        if (productDTO.getStatus() != null)
            product.setStatus(productDTO.getStatus());
        if (productDTO.getPrice() != null)
            product.setPrice(Double.valueOf(productDTO.getPrice()));
        if (!productDTO.getCategories().isEmpty()) {
            productDTO.getCategories().forEach(categoryIdStr -> {
                categoryRepository.findById(Integer.valueOf(categoryIdStr)).ifPresent(product::addCategory);
            });
        }
        return product;
    }
}
