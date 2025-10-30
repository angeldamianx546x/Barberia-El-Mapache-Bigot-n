package com.elmapachebigoton.barberia_api.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "sucursal")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Sucursal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 255)
    private String direccion;

    @Column(length = 30)
    private String telefono;

    @Column(length = 100)
    private String ciudad;

    @Column(length = 100)
    private String estado;

    @Column(length = 10)
    private String codigoPostal;

    @Column(length = 100)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String horarioAtencion;

    @Column(nullable = false)
    private Boolean activa = true;
    
    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Cita> citas;
}
