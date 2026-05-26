package com.accenture.api.infrastructure.adapters.in.web;

import com.accenture.api.application.dtos.ProductoRequest;
import com.accenture.api.domain.entities.Producto;
import com.accenture.api.application.usecases.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @PostMapping
    public ResponseEntity<Producto> agregarProducto(@Valid @RequestBody ProductoRequest request) {
        return new ResponseEntity<>(productoService.agregarProducto(request), HttpStatus.CREATED);
    }

    @DeleteMapping("/sucursal/{sucursalId}/producto/{productoId}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long sucursalId, @PathVariable Long productoId) {
        productoService.eliminarProducto(sucursalId, productoId);
        return ResponseEntity.noContent().build(); 
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Producto> modificarStock(@PathVariable Long id, @RequestParam Integer nuevoStock) {
        return ResponseEntity.ok(productoService.modificarStock(id, nuevoStock));
    }

    @GetMapping("/franquicia/{franquiciaId}/max-stock")
    public ResponseEntity<List<Producto>> obtenerProductosMayorStock(@PathVariable Long franquiciaId) {
        return ResponseEntity.ok(productoService.obtenerProductosMayorStockPorSucursal(franquiciaId));
    }

    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodos() {
        return ResponseEntity.ok(productoService.obtenerTodos());
    }
}