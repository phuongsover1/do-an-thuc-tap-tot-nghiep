package com.thuctap.fastfood.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Table(name = "products")
@Entity(name = "Product")
public class Product {

    @Id
    @SequenceGenerator(
            name = "product",
            sequenceName = "product",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_sequence")
    @Column(name = "id", columnDefinition = "INT(11)")
    private Integer id;

    @Column(name = "name", nullable = false, columnDefinition = "VARCHAR(255)")
    private String name;

    @Column(name = "status")
    private Boolean status = true;

    @Column(name = "price")
    private Double price;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "productId", fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<ProductImage> images;

    @ManyToMany
    @JoinTable(name = "category_product"
            , joinColumns = @JoinColumn(name = "id_product"),
            inverseJoinColumns = @JoinColumn(name = "id_category")
    )
    @JsonBackReference
    private Set<Category> categories = new HashSet<>();

    @PreRemove
    private void removeMembers() {
        this.images.clear();
        this.categories.clear();
    }

    public void addCategory(Category category) {
        categories.add(category);
    }

    public void addImage(ProductImage productImage) {
        images.add(productImage);
        productImage.setProductId(this);
    }
}
