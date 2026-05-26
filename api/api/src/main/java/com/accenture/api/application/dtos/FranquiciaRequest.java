package com.accenture.api.application.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FranquiciaRequest {

    @NotBlank(message = "El nombre de la franquicia es obligatorio")
    private String nombre;
}