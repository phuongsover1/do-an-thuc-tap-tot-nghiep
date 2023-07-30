package com.thuctap.fastfood.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "good_export_notes")
@Entity(name = "ProductExportNote")
public class ProductExportNote {
  @Id
  @SequenceGenerator(
      name = "good_export_notes_sequence",
      sequenceName = "good_export_notes_sequence",
      allocationSize = 1)
  private Integer id;

  @OneToOne
  @JoinColumn(name = "id_bill")
  private Bill bill;

  @Column(name = "date")
  private LocalDateTime date;
}
