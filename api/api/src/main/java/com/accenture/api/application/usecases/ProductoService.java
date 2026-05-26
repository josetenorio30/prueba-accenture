package com.accenture.api.application.usecases;

import com.accenture.api.application.dtos.ProductoRequest;
import com.accenture.api.domain.entities.Producto;
import com.accenture.api.domain.entities.Sucursal;
import com.accenture.api.infrastructure.adapters.out.database.ProductoRepository;
import com.accenture.api.infrastructure.adapters.out.database.SucursalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final SucursalRepository sucursalRepository;

    @Transactional
    public Producto agregarProducto(ProductoRequest request) {
        Sucursal sucursal = sucursalRepository.findById(request.getSucursalId())
                .orElseThrow(() -> new RuntimeException("La sucursal especificada no existe."));

        Producto producto = Producto.builder()
                .nombre(request.getNombre())
                .stock(request.getStock())
                .sucursal(sucursal)
                .build();
                
        return productoRepository.save(producto);
    }

    @Transactional
    public void eliminarProducto(Long sucursalId, Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado."));
        
        if (!producto.getSucursal().getId().equals(sucursalId)) {
            throw new RuntimeException("El producto no pertenece a la sucursal indicada.");
        }
        
        productoRepository.delete(producto);
    }

    @Transactional
    public Producto modificarStock(Long productoId, Integer nuevoStock) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado."));
        
        producto.setStock(nuevoStock);
        return productoRepository.save(producto);
    }

    @Transactional(readOnly = true)
    public List<Producto> obtenerProductosMayorStockPorSucursal(Long franquiciaId) {
        return productoRepository.findTopProductosPorSucursal(franquiciaId);
    }

    @Transactional(readOnly = true)
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }
}