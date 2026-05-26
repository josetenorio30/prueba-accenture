package com.accenture.api.application.usecases;

import com.accenture.api.application.dtos.FranquiciaRequest;
import com.accenture.api.domain.entities.Franquicia;
import com.accenture.api.infrastructure.adapters.out.database.FranquiciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FranquiciaService {

    private final FranquiciaRepository franquiciaRepository;

    @Transactional
    public Franquicia agregarFranquicia(FranquiciaRequest request) {
        Franquicia franquicia = Franquicia.builder()
                .nombre(request.getNombre())
                .build();
        
        return franquiciaRepository.save(franquicia);
    }

    @Transactional(readOnly = true)
    public List<Franquicia> obtenerTodas() {
        return franquiciaRepository.findAll();
    }
}