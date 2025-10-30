package com.elmapachebigoton.barberia_api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "cita")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_cliente", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_barbero", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Barbero barbero;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_servicio", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Servicio servicio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_sucursal", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Sucursal sucursal;
}
