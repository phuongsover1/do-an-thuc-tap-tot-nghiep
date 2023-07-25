package com.thuctap.fastfood.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "product_images")
@Entity(name = "ProductImage")
public class ProductImage {
    @Id
    @SequenceGenerator(
            name = "product_images_sequence",
            sequenceName = "product_images_sequence",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_images_sequence")
    @Column(name = "id", columnDefinition = "INT(11)")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product productId;

    @Column(name = "image_name")
    private String imageName;

    @Lob
    @Column(name = "image")
    private byte[] image;
}
