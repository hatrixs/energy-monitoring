# Energy Monitoring Backend

Backend para la plataforma de monitoreo energético desarrollado con NestJS.

## Descripción

Este proyecto forma parte de una plataforma completa de monitoreo energético, trabajando en conjunto con el [frontend](https://github.com/hatrixs/Energy-Monitoring-Frontend) que se encuentra en un repositorio separado.

## Requisitos Previos

- Node.js (v20 o superior)
- Yarn
- MongoDB Atlas (recomendado)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
```

2. Instalar dependencias:
```bash
yarn install
```

3. Configurar variables de entorno:
   - Copiar el archivo `.env.template` a `.env`
   - Actualizar las variables según tu entorno

## Configuración de Base de Datos

El proyecto utiliza MongoDB como base de datos y Prisma como ORM.

### ¿Por qué MongoDB Atlas?

Se recomienda utilizar MongoDB Atlas debido a que Prisma requiere soporte para transacciones, las cuales necesitan una configuración de cluster con múltiples nodos. MongoDB Atlas proporciona esta configuración por defecto.

Si decides utilizar una instalación local de MongoDB, deberás configurar un replica set para habilitar el soporte de transacciones.

### Configuración de la Base de Datos

1. Crear una cuenta en MongoDB Atlas (si aún no tienes una)
2. Crear un nuevo cluster
3. Obtener la URL de conexión
4. Actualizar la variable de entorno `DATABASE_URL` en tu archivo `.env`

## Desarrollo

Para iniciar el servidor en modo desarrollo:

```bash
yarn start:dev
```

## Estructura de API

Todos los endpoints de la API están prefijados con `/api`

## Sistema de Autenticación

El sistema implementa dos estrategias de autenticación diferentes para satisfacer distintos casos de uso:

### JWT Strategy
- Autenticación tradicional mediante correo y contraseña
- Genera tokens JWT con tiempo de expiración
- Ideal para usuarios que interactúan directamente con la plataforma
- Manejo de sesiones con tiempo limitado por seguridad

### API Key Strategy
- Sistema de autenticación mediante API Keys
- Diseñado específicamente para dispositivos y sistemas externos (sensores, servidores, etc.)
- Las API Keys no expiran automáticamente
- Control manual de activación/desactivación de API Keys
- Permite verificar y autorizar el origen de los datos de los sensores
- Recomendado para la integración de dispositivos IoT y sistemas automatizados

## Decisiones de Arquitectura

### Framework y Estructura
- Se eligió NestJS como framework principal debido a su arquitectura robusta y modular
- Implementa patrones de diseño sólidos y principios SOLID
- Facilita la implementación de programación orientada a objetos de manera organizada
- Sistema de inyección de dependencias incorporado que mejora la mantenibilidad y testabilidad
- Estructura del proyecto clara y escalable basada en módulos

### Comunicación en Tiempo Real
- Implementación de WebSockets para la transmisión de mediciones en tiempo real
- Elección basada en la necesidad de actualizaciones instantáneas y bidireccionales
- Reduce la latencia y el overhead en comparación con polling tradicional
- Permite una experiencia más fluida en el monitoreo de datos energéticos
- Escalable para manejar múltiples conexiones simultáneas

### Patrón Repository
- Implementación del patrón Repository para abstraer la capa de acceso a datos
- Separa la lógica de negocio de la implementación específica de la base de datos
- Facilita el mantenimiento y la realización de pruebas unitarias
- Permite cambiar el origen de datos sin afectar la lógica de negocio
- Mejora la organización del código y reduce el acoplamiento
- Facilita la implementación de caché y optimizaciones de rendimiento

## Observaciones y Recomendaciones para Escalabilidad

### Gestión de Datos Temporales
- Considerar la implementación de Amazon Timestream como base de datos especializada para series temporales
- Optimizado para el manejo de datos IoT y métricas de sensores a gran escala
- Mejor rendimiento en consultas de datos históricos y análisis temporal

### Arquitectura Multi-tenant
- Para un sistema empresarial escalable, se recomienda implementar una arquitectura multi-tenant
- Cada cliente tendría su propia base de datos aislada
- Mejora en la gobernanza de datos y seguridad
- Mayor flexibilidad en la personalización por cliente
- Facilita el cumplimiento de regulaciones de datos específicas por región o industria

### Motores de Búsqueda
- Implementar Elasticsearch o Typesense para búsquedas avanzadas
- Mejora significativa en el rendimiento de búsquedas complejas
- Capacidades de análisis en tiempo real
- Facilita la implementación de dashboards y visualizaciones
- Mejor manejo de grandes volúmenes de datos históricos

## Aplicación en Producción

La aplicación se encuentra desplegada y disponible en:
[https://energy-monitoring-frontend.vercel.app/](https://energy-monitoring-frontend.vercel.app/)

