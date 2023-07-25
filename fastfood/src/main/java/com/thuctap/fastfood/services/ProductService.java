package com.thuctap.fastfood.services;

import com.thuctap.fastfood.dto.ProductDTO;
import com.thuctap.fastfood.entities.Product;
import com.thuctap.fastfood.entities.ProductImage;
import com.thuctap.fastfood.repositories.ProductImagesRepository;
import com.thuctap.fastfood.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductImagesRepository productImagesRepository;


    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void saveImage(ProductImage productImage, Product product){
        product.addImage(productImage);
        productImagesRepository.save(productImage);
        productRepository.save(product);
    }

    public Optional<Product> findById(Integer id) {
        return productRepository.findById(id);
    }

    public Optional<ProductImage> findImageByProductAndName(Product product, String imageName) {
        return productImagesRepository.findProductImageByProductIdAndImageName(product, imageName);
    }

    public Product createProductFromMap(Map<String, Object> map) {
        ProductDTO productDTO = new ProductDTO();

        if (map.containsKey("name"))
            productDTO.setName((String) map.get("name"));
        if (map.containsKey("description"))
            productDTO.setDescription((String) map.get("description"));
        if (map.containsKey("price"))
            productDTO.setPrice((Double.valueOf((String) map.get("price"))));
        if (map.containsKey("status")) {
            if (map.get("status") instanceof String) {
                productDTO.setStatus(Boolean.parseBoolean((String) map.get("status")));
            }
            if (map.get("status") instanceof Boolean) {
                productDTO.setStatus((Boolean) map.get("status"));
            }
        }
        return convertProductDTOToProduct(productDTO);
    }

    private Product convertProductDTOToProduct(ProductDTO productDTO){
        Product product = new Product();
        if (productDTO.getName() != null)
            product.setName(productDTO.getName());
        if (productDTO.getDescription() != null)
            product.setDescription(productDTO.getDescription());
        if (productDTO.getStatus() != null)
            product.setStatus(productDTO.getStatus());
        if (productDTO.getPrice() != null)
            product.setPrice(productDTO.getPrice());
        return product;
    }
}
