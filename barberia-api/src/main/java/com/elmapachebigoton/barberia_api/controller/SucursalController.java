package com.elmapachebigoton.barberia_api.controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.elmapachebigoton.barberia_api.model.Sucursal;
import com.elmapachebigoton.barberia_api.repository.SucursalRepository;

@RestController
@RequestMapping("/api/sucursales")
public class SucursalController {
    @Autowired
    private SucursalRepository sucursalRepository;

    @GetMapping
    public ResponseEntity<Iterable<Sucursal>> findAll() {
        return ResponseEntity.ok(sucursalRepository.findAll());
    }

    @GetMapping("/activas")
    public ResponseEntity<List<Sucursal>> findActivas() {
        return ResponseEntity.ok(sucursalRepository.findByActivaTrue());
    }

    @GetMapping("/ciudad/{ciudad}")
    public ResponseEntity<List<Sucursal>> findByCiudad(@PathVariable String ciudad) {
        return ResponseEntity.ok(sucursalRepository.findByCiudad(ciudad));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sucursal> findById(@PathVariable Integer id) {
        Optional<Sucursal> sucursal = sucursalRepository.findById(id);
        return sucursal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Sucursal> create(@RequestBody Sucursal sucursal, UriComponentsBuilder uriBuilder) {
        Sucursal created = sucursalRepository.save(sucursal);
        URI uri = uriBuilder.path("/api/sucursales/{id}").buildAndExpand(created.getId()).toUri();
        return ResponseEntity.created(uri).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sucursal> update(@PathVariable Integer id, @RequestBody Sucursal sucursal) {
        if (!sucursalRepository.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        sucursal.setId(id);
        Sucursal updated = sucursalRepository.save(sucursal);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!sucursalRepository.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        sucursalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Sucursal> desactivar(@PathVariable Integer id) {
        Optional<Sucursal> sucursalOpt = sucursalRepository.findById(id);
        if (!sucursalOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Sucursal sucursal = sucursalOpt.get();
        sucursal.setActiva(false);
        Sucursal updated = sucursalRepository.save(sucursal);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Sucursal> activar(@PathVariable Integer id) {
        Optional<Sucursal> sucursalOpt = sucursalRepository.findById(id);
        if (!sucursalOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Sucursal sucursal = sucursalOpt.get();
        sucursal.setActiva(true);
        Sucursal updated = sucursalRepository.save(sucursal);
        return ResponseEntity.ok(updated);
    }
}
