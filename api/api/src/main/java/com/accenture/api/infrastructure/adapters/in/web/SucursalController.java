package com.accenture.api.infrastructure.adapters.in.web;

import com.accenture.api.application.dtos.SucursalRequest;
import com.accenture.api.domain.entities.Sucursal;
import com.accenture.api.application.usecases.SucursalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sucursales")
@RequiredArgsConstructor
public class SucursalController {

    private final SucursalService sucursalService;

    @PostMapping
    public ResponseEntity<Sucursal> agregarSucursal(@Valid @RequestBody SucursalRequest request) {
        return new ResponseEntity<>(sucursalService.agregarSucursal(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Sucursal>> obtenerTodas() {
        return ResponseEntity.ok(sucursalService.obtenerTodas());
    }
}