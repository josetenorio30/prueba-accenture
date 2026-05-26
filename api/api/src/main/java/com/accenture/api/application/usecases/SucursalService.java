package com.accenture.api.application.usecases;

import com.accenture.api.application.dtos.SucursalRequest;
import com.accenture.api.domain.entities.Franquicia;
import com.accenture.api.domain.entities.Sucursal;
import com.accenture.api.infrastructure.adapters.out.database.FranquiciaRepository;
import com.accenture.api.infrastructure.adapters.out.database.SucursalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SucursalService {

    private final SucursalRepository sucursalRepository;
    private final FranquiciaRepository franquiciaRepository;

    @Transactional
    public Sucursal agregarSucursal(SucursalRequest request) {
        Franquicia franquicia = franquiciaRepository.findById(request.getFranquiciaId())
                .orElseThrow(() -> new RuntimeException("La franquicia especificada no existe."));

        Sucursal sucursal = Sucursal.builder()
                .nombre(request.getNombre())
                .franquicia(franquicia)
                .build();
                
        return sucursalRepository.save(sucursal);
    }

    @Transactional(readOnly = true)
    public List<Sucursal> obtenerTodas() {
        return sucursalRepository.findAll();
    }
}