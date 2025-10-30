package com.elmapachebigoton.barberia_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elmapachebigoton.barberia_api.model.Sucursal;

public interface SucursalRepository extends JpaRepository<Sucursal,Integer>{
    List<Sucursal> findByActivaTrue();
    
    List<Sucursal> findByCiudad(String ciudad);
}
