package com.accenture.api.application.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SucursalRequest {

    @NotBlank(message = "El nombre de la sucursal es obligatorio")
    private String nombre;

    @NotNull(message = "El ID de la franquicia es obligatorio")
    private Long franquiciaId;
}