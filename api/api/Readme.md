
```markdown
# 🏢 Franquicias API - Backend Técnico

Esta API RESTful fue desarrollada para gestionar de manera eficiente la relación entre franquicias, sucursales y el stock de productos. El proyecto está construido bajo los más altos estándares de calidad, asegurando un código limpio, mantenible y preparado para entornos en la nube.

## 🚀 Tecnologías y Herramientas

* **Core:** Java 21 LTS, Spring Boot 3.x
* **Arquitectura:** Clean Architecture (Domain, Application, Infrastructure)
* **Persistencia:** MySQL 8.0, Spring Data JPA
* **Contenedorización:** Docker, Docker Compose (Multi-stage builds)
* **Infraestructura como Código (IaC):** Terraform (Simulación de despliegue en AWS)
* **Documentación:** OpenAPI 3.0 (Swagger)
* **Testing:** JUnit 5, Mockito

---

## ✨ Funcionalidades Principales

La API cumple con todos los criterios de aceptación requeridos:
- [x] Agregar una nueva franquicia.
- [x] Agregar una nueva sucursal a una franquicia existente.
- [x] Agregar un nuevo producto a una sucursal.
- [x] Eliminar un producto de una sucursal.
- [x] Modificar el stock de un producto.
- [x] Obtener el producto con mayor stock por sucursal para una franquicia puntual.
- [x] Endpoints complementarios de lectura (GET) para todas las entidades.

---

## 📐 Decisiones de Arquitectura y Diseño

Para garantizar la escalabilidad a largo plazo, el proyecto implementa **Clean Architecture**:
1. **Aislamiento del Dominio (`domain`):** Las entidades (`Franquicia`, `Sucursal`, `Producto`) representan reglas puras de negocio. No contienen anotaciones de serialización web ni dependencias externas.
2. **Inversión de Dependencias (SOLID):** La capa de Aplicación (`usecases`) orquesta la lógica interactuando con los adaptadores de salida (`repositories`) a través de interfaces, desacoplando el negocio del motor de base de datos.
3. **Seguridad y Validación (`dtos`):** Se utilizan Objetos de Transferencia de Datos para recibir y validar peticiones (`@Valid`), evitando la exposición directa de las entidades de la base de datos.
4. **Manejo de Errores Global (Fail-Fast):** Se implementó un `@RestControllerAdvice` para capturar excepciones de negocio y transformarlas en respuestas HTTP (400 Bad Request) limpias, evitando los errores 500 del servidor.
5. **Control de Relaciones JPA:** Se manejó estratégicamente la serialización JSON (usando `@JsonIgnoreProperties`) para evitar problemas de recursividad infinita inherentes a las relaciones bidireccionales, manteniendo la eficiencia en memoria del `FetchType.LAZY`.

---

## 📋 Requisitos Previos

El proyecto está completamente contenerizado, por lo que tu entorno local se mantiene limpio. Solo necesitas tener instalado:
* **Docker** y **Docker Compose** (Docker Desktop en Windows/Mac).
* **Git** (Para clonar el repositorio).
> **Nota:** No es necesario tener instalado Java, Maven ni MySQL localmente para ejecutar la API.

---

## 🛠️ Instrucciones de Despliegue (Entorno Local)

1. **Clonar el repositorio:**
   ```bash
   git clone <tu-url-del-repositorio>
   cd franquicias-api

```

2. **Construir y levantar los contenedores:**
```bash
docker compose up -d --build

```


*Este comando compilará el código Java de forma aislada, levantará la base de datos MySQL, ejecutará las migraciones estructurales (DDL) y conectará la API en una red interna segura.*
3. **Detener la aplicación:**
```bash
docker compose down

```



---

## 📖 Documentación Interactiva (Swagger)

Una vez que el contenedor reporte estar en ejecución, puedes explorar, probar y consumir todos los endpoints directamente desde tu navegador a través de la interfaz de Swagger UI:

👉 **URL de acceso:** [http://localhost:8080/swagger-ui.html](https://www.google.com/search?q=http://localhost:8080/swagger-ui.html)

---

## ☁️ Infraestructura como Código (IaC)

El proyecto incluye un directorio `/infrastructure-as-code` que contiene un archivo `main.tf` de **Terraform**. Este script demuestra cómo se aprovisionaría la infraestructura necesaria (una instancia RDS MySQL) en un entorno de producción real utilizando AWS como proveedor de nube.

---

## 🧪 Ejecución de Pruebas Unitarias

Se incluyeron pruebas unitarias para validar las reglas de negocio en la capa de Aplicación, utilizando mocks para aislar la lógica y no depender de la base de datos.

Si deseas ejecutar las pruebas localmente (requiere Maven en tu equipo), utiliza:

```bash
mvn test

```

```

```