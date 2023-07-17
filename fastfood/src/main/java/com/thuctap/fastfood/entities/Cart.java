package com.thuctap.fastfood.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "Cart")
@Table(name = "carts")
@Getter
@Setter
public class Cart {

  @Id
  @SequenceGenerator(name = "cart_sequence", sequenceName = "cart_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cart_sequence")
  @Column(name = "id", columnDefinition = "INT(11)")
  private Integer id;
}
