package com.thuctap.fastfood.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

@Getter
@Setter
@Table(name = "staffs")
@Entity(name = "Staff")
public class Staff {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO, generator = "custom-id-generator")
  @GenericGenerator(
      name = "custom-id-generator",
      strategy = "com.thuctap.fastfood.entities.stringId.StaffIdGenerator")
  private String id;

  @Column(name = "first_name", nullable = false)
  private String firstName;

  @Column(name = "last_name", nullable = false)
  private String lastName;

  @Column(name = "date_of_birth", nullable = false)
  private LocalDate dateOfBirth;

  @Column(name = "sex", nullable = false)
  private boolean sex;

  @Column(name = "address", nullable = false, unique = true)
  private String address;

  @Column(name = "is_working", nullable = false)
  private boolean isWorking = true;

  @Column(name = "email", nullable = false, unique = true)
  private String email;
}
