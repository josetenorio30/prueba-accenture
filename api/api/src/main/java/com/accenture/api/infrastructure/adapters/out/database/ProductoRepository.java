package com.accenture.api.infrastructure.adapters.out.database;

import com.accenture.api.domain.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /**
     * Obtiene el producto con mayor stock por cada sucursal de una franquicia específica.
     * Criterio de aceptación 7 y 12.
     */
    @Query("SELECT p FROM Producto p " +
           "WHERE p.sucursal.franquicia.id = :franquiciaId " +
           "AND p.stock = (" +
           "    SELECT MAX(p2.stock) FROM Producto p2 WHERE p2.sucursal.id = p.sucursal.id" +
           ")")
    List<Producto> findTopProductosPorSucursal(@Param("franquiciaId") Long franquiciaId);
}