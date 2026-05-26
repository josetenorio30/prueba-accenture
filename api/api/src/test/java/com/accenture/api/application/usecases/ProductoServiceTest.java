package com.accenture.api.application.usecases;

import com.accenture.api.application.dtos.ProductoRequest;
import com.accenture.api.domain.entities.Producto;
import com.accenture.api.domain.entities.Sucursal;
import com.accenture.api.infrastructure.adapters.out.database.ProductoRepository;
import com.accenture.api.infrastructure.adapters.out.database.SucursalRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private SucursalRepository sucursalRepository;

    @InjectMocks
    private ProductoService productoService;

    @Test
    void agregarProducto_Exito() {
        // Arrange (Preparar)
        ProductoRequest request = new ProductoRequest();
        request.setNombre("Laptop");
        request.setStock(10);
        request.setSucursalId(1L);

        Sucursal sucursalMock = new Sucursal();
        sucursalMock.setId(1L);

        Producto productoGuardado = new Producto();
        productoGuardado.setId(100L);
        productoGuardado.setNombre("Laptop");
        productoGuardado.setStock(10);

        when(sucursalRepository.findById(1L)).thenReturn(Optional.of(sucursalMock));
        when(productoRepository.save(any(Producto.class))).thenReturn(productoGuardado);

        // Act (Ejecutar)
        Producto resultado = productoService.agregarProducto(request);

        // Assert (Verificar)
        assertNotNull(resultado);
        assertEquals(100L, resultado.getId());
        assertEquals("Laptop", resultado.getNombre());
        verify(sucursalRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    void agregarProducto_SucursalNoExiste_LanzaExcepcion() {
        // Arrange
        ProductoRequest request = new ProductoRequest();
        request.setSucursalId(99L);

        when(sucursalRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            productoService.agregarProducto(request);
        });

        assertEquals("La sucursal especificada no existe.", exception.getMessage());
        verify(productoRepository, never()).save(any());
    }
}