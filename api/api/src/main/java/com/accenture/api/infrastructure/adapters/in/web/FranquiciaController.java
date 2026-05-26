package com.accenture.api.infrastructure.adapters.in.web;

import com.accenture.api.application.dtos.FranquiciaRequest;
import com.accenture.api.domain.entities.Franquicia;
import com.accenture.api.application.usecases.FranquiciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/franquicias")
@RequiredArgsConstructor
public class FranquiciaController {

    private final FranquiciaService franquiciaService;

    @PostMapping
    public ResponseEntity<Franquicia> agregarFranquicia(@Valid @RequestBody FranquiciaRequest request) {
        return new ResponseEntity<>(franquiciaService.agregarFranquicia(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Franquicia>> obtenerTodas() {
        return ResponseEntity.ok(franquiciaService.obtenerTodas());
    }
}