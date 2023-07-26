package com.thuctap.fastfood.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Table(name = "categories")
@Entity(name = "Category")
public class Category {

    @Id
    @SequenceGenerator(
            name = "categories_sequence",
            sequenceName = "categories_sequence",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "categories_sequence")
    @Column(name = "id", columnDefinition = "INT(11)")
    private Integer id;

    @Column(name = "name", columnDefinition = "VARCHAR(255)")
    private String name;

    @Column(name = "description", columnDefinition = "VARCHAR(500)")
    private String description;

    @ManyToMany(mappedBy = "categories")
    @JsonManagedReference
    List<Product> products = new ArrayList<>();

}
