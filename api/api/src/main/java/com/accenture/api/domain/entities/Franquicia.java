package com.accenture.api.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "franquicias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Franquicia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @OneToMany(mappedBy = "franquicia", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Sucursal> sucursales = new ArrayList<>();
}