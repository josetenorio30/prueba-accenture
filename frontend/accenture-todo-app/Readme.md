

# 📱 To-Do List Mobile Application (Accenture Assessment)

Solución robusta para la gestión de tareas y categorías en entornos móviles, desarrollada con **Ionic 7**, **Angular 17+** utilizando **Componentes Standalone**, y gobernada de forma remota mediante **Firebase Remote Config**.

La aplicación implementa un diseño UX/UI de vanguardia con interfaces adaptativas, persistencia local completa y optimizaciones avanzadas de rendimiento para asegurar una experiencia fluida y nativa.


## 🏗️ Arquitectura del Proyecto

El proyecto sigue principios de **Clean Architecture** y una estructura orientada a dominios (Domain-Driven Organization). Esto permite un desacoplamiento absoluto entre la persistencia, la lógica de negocio y la capa de presentación.

### Estructura de Directorios
* `src/app/core/`: Capa central de infraestructura. Contiene los servicios globales de persistencia local (`task.service.ts`, `category.service.ts`) y el proveedor de control remoto de características (`feature-flag.service.ts`).
* `src/app/domain/models/`: Modelos de datos e interfaces estrictas de TypeScript (`Task`, `Category`). Asegura la integridad del tipado en toda la aplicación.
* `src/app/features/`: Módulos de funcionalidades de cara al usuario (vistas, estilos y componentes de presentación).

---

## 🛠️ Decisiones de Ingeniería y Respuestas Técnicas

### 1. Desafíos Técnicos y Soluciones Implementadas
* **Contexto de Inyección de Firebase:** Uno de los desafíos más complejos fue la inicialización asíncrona de las APIs de la SDK de Firebase (`fetchAndActivate` y `getBoolean`) dentro del ecosistema moderno de Standalone Components. Invocar estas funciones de forma temprana causaba advertencias críticas de estabilidad fuera del contexto de inyección (`warnOutsideInjectionContext`). Para solucionarlo de raíz, se encapsuló la carga utilizando `runInInjectionContext` alimentado por el `Injector` nativo de Angular, garantizando la perfecta sincronización con el ciclo de vida del framework.
* **Ciclos de Animación y Superposición de UI:** En la navegación híbrida, abrir diálogos nativos (`AlertController`) o modales inferiores (`ion-modal`) mientras el menú lateral (`ion-menu`) permanece activo provoca conflictos en la capa de interacción (Z-Index). La lógica se optimizó cerrando programáticamente el menú de forma asíncrona mediante promesas antes de despachar cualquier modal, asegurando transiciones limpias y sin bloqueos de pantalla.
* **Control Dinámico de Presupuestos (Budgets):** El diseño visual premium incrementó el tamaño del archivo de estilos del componente principal superando los límites por defecto de Angular. Se reconfiguraron estratégicamente los límites de compilación (`anyComponentStyle`) en el archivo `angular.json` para absorber la carga estética sin penalizar el rendimiento.

### 2. Técnicas de Optimización de Rendimiento
* **Estrategia OnPush (Change Detection):** El componente principal está configurado con `ChangeDetectionStrategy.OnPush`. Angular no realiza verificaciones automáticas y pesadas en cada evento del DOM; la interfaz solo se renderiza cuando las referencias de los flujos de datos inmutables cambian explícitamente.
* **Programación Reactiva con RxJS:** Toda la manipulación de estados se procesa mediante flujos observables (`BehaviorSubject` y `combineLatest`). El consumo de datos en la vista se realiza exclusivamente mediante el pipe `async`. Esto delega en Angular la suscripción y la desuscripción automática al destruir componentes, eliminando por completo las fugas de memoria (*memory leaks*).
* **Inmutabilidad de Datos:** Las operaciones sobre el almacenamiento local emplean operadores de propagación (Spread Operator) para generar nuevas instancias en memoria, optimizando los algoritmos de comparación del framework.

### 3. Calidad y Mantenibilidad del Código
* **Acoplamiento Débil:** Los componentes no conocen de dónde provienen los datos ni cómo se guardan; solo consumen abstracciones reactivas de los servicios de infraestructura.
* **Desacoplamiento de UI vía Feature Flags:** La alternancia entre la versión básica y el dashboard premium se maneja en tiempo de ejecución. Esto permite apagar o encender características completas desde la nube sin necesidad de recompilar el código ni redistribuir paquetes en las tiendas de aplicaciones.

---

## ⚙️ Configuración y Despliegue Local

### Prerrequisitos
Garantiza tener instaladas las siguientes herramientas globales en tu sistema:
- Node.js (v18+)
- Ionic CLI (`npm install -g @ionic/cli`)
- Cordova CLI (`npm install -g cordova`)

### 1. Inicialización del Entorno
```bash
# Instalar dependencias del proyecto
npm install

# Levantar el servidor de desarrollo local con recarga en vivo
ionic serve

```

### 2. Compilación de Artefactos de Producción

Para garantizar que la aplicación web se empaquete de manera óptima antes de transferirse al contenedor nativo, el proceso se divide en dos fases:

**Fase 1: Construcción Web de Angular**

```bash
ionic build --prod

```

*Este comando compila el código TypeScript, minifica los scripts y genera la distribución optimizada en la carpeta `/www`.*

**Fase 2: Compilación Nativa (Android APK)**

```bash
cordova build android

```

El instalador ejecutable final se generará en la siguiente ruta:
`platforms/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🌐 Conectividad con Firebase Remote Config

La aplicación está vinculada a un proyecto real de Firebase. El comportamiento de la interfaz está gobernado por el parámetro remoto:

* **Clave:** `enable_premium_categories`
* **Tipo:** Booleano (`true` / `false`)

Para realizar pruebas inmediatas sin latencia de red, el intervalo de caché en el entorno de desarrollo se ha configurado temporalmente en `0` milisegundos en el archivo `main.ts` (`minimumFetchIntervalMillis: 0`). Esto permite que cualquier cambio publicado en la consola de Firebase se refleje instantáneamente al actualizar la aplicación.

