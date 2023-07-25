package com.thuctap.fastfood.entities;

import jakarta.persistence.*;

import java.util.List;

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
  private boolean status = true;

  @Column(name = "price")
  private double price;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "productId")
  private List<ProductImage> images;
}
