package com.thuctap.fastfood.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

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

  @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
  @JsonManagedReference
  private Set<CartProduct> cartProducts = new HashSet<>();


  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Cart cart = (Cart) o;

    return id.equals(cart.id);
  }

  @Override
  public int hashCode() {
    return id.hashCode();
  }
}
