# 🚀 Solución Prueba Técnica - Accenture To-Do App

Este repositorio contiene la solución integral (Full Stack) para la prueba técnica de desarrollo solicitada por Accenture. El proyecto está estructurado mediante un enfoque de **Monorepo**, separando claramente las responsabilidades de la capa de servicios (Backend) y la capa de presentación nativa/híbrida (Frontend).

## 📂 Estructura del Repositorio

El código fuente está dividido en dos módulos principales, cada uno con su propio entorno, dependencias y documentación específica:

* **📁 `/api` (Backend):** Contiene la lógica de servidor, exposición de endpoints RESTful y la gestión de la base de datos de la aplicación.
* **📁 `/frontend` (Mobile App):** Contiene la aplicación móvil híbrida desarrollada con Ionic 7 y Angular 17+ (Standalone Components). Implementa persistencia local offline y gestión dinámica de UI mediante Firebase Remote Config.

---

## 📖 Documentación Específica (Instrucciones de Ejecución)

Para evaluar, compilar y ejecutar cada parte de este sistema, por favor dirígete a la documentación detallada ubicada dentro de cada módulo. 

👉 **[Ver Documentación del Frontend (Mobile App)](./frontend/accenture-todo-app/Readme.md)**
*En este archivo encontrarás:*
* Respuestas técnicas sobre los desafíos de arquitectura y optimización de rendimiento.
* Instrucciones para levantar el entorno de desarrollo con Ionic.
* Instrucciones para la compilación de instaladores nativos (APK vía Cordova).

👉 **[Ver Documentación del Backend (API)](./api/api/Readme.md)**
*En este archivo encontrarás:*
* Requisitos previos del servidor.
* Instrucciones de instalación y ejecución local.

---

## 🛠️ Stack Tecnológico Principal

**Frontend:**
* Ionic Framework (v7)
* Angular (v17+ con Standalone Components)
* RxJS (Programación Reactiva)
* Firebase Remote Config (Feature Flags)
* `@ionic/storage-angular` (Persistencia SQLite local)
* Apache Cordova (Empaquetado Nativo)

**Backend:**
* *(Nota para el evaluador: Las tecnologías específicas del backend están detalladas en su respectivo módulo `/api`).*

---

> **Nota para el equipo evaluador:** > Se ha priorizado la aplicación de principios de Clean Architecture y la inmutabilidad de datos para garantizar la escalabilidad y mantenibilidad de ambos módulos. Las justificaciones arquitectónicas específicas de las pruebas exigidas se encuentran detalladas en el README del módulo Frontend.