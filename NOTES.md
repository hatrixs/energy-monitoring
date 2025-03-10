# Bases de datos para aplicaciones IoT con datos de sensores

## Bases de datos especializadas en series temporales

Para aplicaciones que manejan grandes volúmenes de datos de sensores IoT con timestamps, las siguientes bases de datos ofrecen mejor rendimiento que MongoDB:

1. **InfluxDB**

   - Diseñada específicamente para series temporales
   - Excelente para alta ingesta de datos de sensores
   - Compresión optimizada para datos de series temporales
   - Lenguaje de consulta (Flux) especializado para análisis temporal
   - Retención de datos configurable y políticas de downsampling

2. **TimescaleDB**

   - Extensión de PostgreSQL para series temporales
   - Combina la potencia SQL con optimizaciones para datos temporales
   - Escala horizontalmente para grandes volúmenes
   - Familiar para equipos que ya conocen PostgreSQL
   - Mantiene todas las características relacionales de PostgreSQL

3. **Amazon Timestream**

   - Servicio gestionado de AWS para datos de series temporales
   - Escalado automático sin administración
   - Optimizado para IoT y telemetría
   - Separación entre almacenamiento en memoria y almacenamiento frío

4. **Prometheus**
   - Enfocado en monitoreo y métricas
   - Modelo de datos multidimensional con series temporales
   - Excelente integración con Grafana para visualización
   - Lenguaje PromQL para consultas

## Optimizaciones para MongoDB con datos de sensores

Si se debe utilizar MongoDB según requisitos (como en esta prueba técnica):

1. **Índices críticos**:

   - Índice compuesto para consultas por centro: `{ centroTrabajoId: 1, fecha: 1 }`
   - Índice para consultas por sensor: `{ sensorId: 1, fecha: 1 }`
   - Índice para consultas por área: `{ areaId: 1, fecha: 1 }`

2. **TTL (Time To Live)**:

   - Implementar índice TTL para datos antiguos: `{ fecha: 1 }, { expireAfterSeconds: ... }`
   - Considerar estrategias de agregación para datos históricos

3. **Sharding**:

   - Para grandes volúmenes, considerar sharding por `centroTrabajoId` o por rangos de fecha

   ### ¿Qué es Sharding?

   El sharding es una técnica de distribución de datos utilizada en bases de datos para mejorar el rendimiento y la escalabilidad horizontal.

   #### Definición y funcionamiento

   - **Concepto básico**: División de una base de datos en múltiples fragmentos (shards) distribuidos en diferentes servidores físicos.
   - **Objetivo**: Distribuir la carga de trabajo y los datos para manejar volúmenes que serían imposibles en un solo servidor.

   #### Componentes en MongoDB

   1. **Shards**: Servidores individuales que almacenan subconjuntos de los datos.
   2. **Config Servers**: Almacenan los metadatos sobre la ubicación de los datos.
   3. **Router (mongos)**: Dirige las consultas al shard correcto.

   #### Shard Key

   - Campo o combinación de campos que determina cómo se distribuyen los documentos.
   - Crucial para el rendimiento y debe elegirse según patrones de acceso.

   #### Estrategias de partición

   - **Ranged Sharding**: Divide los datos en rangos basados en la shard key.
   - **Hashed Sharding**: Usa una función hash sobre la shard key para distribuir datos uniformemente.

   #### Beneficios para aplicaciones IoT con sensores

   - **Escalabilidad**: Soporta volúmenes masivos de datos de sensores.
   - **Rendimiento**: Mejora la velocidad de escritura al distribuir la carga.
   - **Disponibilidad**: Reduce riesgo al distribuir datos en múltiples servidores.

   #### Consideraciones para datos de sensores

   Para aplicaciones de monitoreo energético, el sharding podría implementarse:

   - Usando `centroTrabajoId` como shard key para consultas por centro
   - Usando rangos de fecha para datos históricos
   - Combinación de ambos en una shard key compuesta

4. **Agregaciones pre-calculadas**:

   - Colección separada con estadísticas diarias/horarias pre-calculadas
   - Pipeline de agregación para generación periódica de resúmenes

5. **Compresión**:
   - Activar compresión de datos en MongoDB para reducir almacenamiento

## Optimizaciones para APIs que reciben datos de sensores

Las aplicaciones IoT requieren considerar aspectos específicos en el diseño de APIs para manejar volúmenes variables de datos de sensores.

### Throttling para protección de API

El throttling es crucial para APIs que reciben datos de múltiples sensores o dispositivos IoT:

1. **Límites por cliente/dispositivo**:

   - Implementar límites de solicitudes por minuto según el tipo de sensor
   - Utilizar identificadores de dispositivo para aplicar diferentes límites
   - Considerar variaciones según hora del día (más permisivo en horarios de baja carga)

2. **Mecanismos de implementación**:

   - **Token bucket**: Permite ráfagas controladas de solicitudes
   - **Leaky bucket**: Procesa solicitudes a velocidad constante
   - **Fixed window**: Limita solicitudes en intervalos fijos de tiempo
   - **Sliding window**: Más preciso pero con mayor costo computacional

3. **Configuraciones recomendadas para sensores energéticos**:

   - Sensores normales: 4-5 solicitudes por minuto por dispositivo
   - Sensores críticos: 10-15 solicitudes por minuto
   - Límite global por centro de trabajo: 100-200 solicitudes por minuto

4. **Respuestas apropiadas**:
   - Utilizar código HTTP 429 (Too Many Requests)
   - Incluir cabeceras con información de límites: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
   - Proporcionar cabecera `Retry-After` con tiempo recomendado de espera

### Procesamiento asíncrono con sistema de colas

Para grandes volúmenes de datos o picos de carga:

1. **Implementación de colas de mensajes**:

   - **RabbitMQ**: Versatilidad y múltiples patrones de mensajería
   - **Apache Kafka**: Ideal para procesamiento de streams de datos de sensores
   - **Redis Streams**: Opción más ligera para volúmenes moderados
   - **Amazon SQS/EventBridge**: Soluciones gestionadas para entornos AWS

2. **Arquitectura recomendada**:

   - API recibe datos y confirma recepción inmediatamente
   - Encolamiento de mensajes para procesamiento posterior
   - Workers independientes procesan mensajes según capacidad
   - Sistema de dead-letter queue para mensajes problemáticos

3. **Beneficios para datos de sensores IoT**:

   - Manejo de picos de tráfico durante eventos especiales
   - Resiliencia ante fallos temporales de base de datos
   - Priorización de procesamiento según tipo de sensor o centro
   - Mejor rendimiento global del sistema

4. **Consideraciones importantes**:
   - Implementar idempotencia para evitar procesamiento duplicado
   - Diseñar modelo de monitoreo para verificar retrasos en el procesamiento
   - Definir estrategias de manejo de errores y reintentos

### Validación por lotes (Batch Processing)

Para optimizar el rendimiento cuando se reciben múltiples mediciones simultáneas:

1. **API de ingesta por lotes**:

   - Endpoint dedicado para recibir arrays de mediciones
   - Validación en bloque más eficiente que validaciones individuales
   - Transacciones únicas en base de datos para múltiples inserciones

2. **Estructura de datos recomendada**:

   ```json
   {
     "centroDeTrabajo": "Centro1",
     "mediciones": [
       {
         "sensorId": "S001",
         "area": "Producción",
         "timestamp": "2023-07-01T14:30:00Z",
         "voltaje": 220.5,
         "corriente": 10.3
       }
       // más mediciones...
     ]
   }
   ```

3. **Estrategias de implementación**:

   - Validación parcial: aceptar lotes con algunas mediciones incorrectas
   - Respuesta detallada con éxitos/fracasos por cada elemento del lote
   - Límites configurables en tamaño máximo de lote (100-1000 mediciones)

4. **Consideraciones de rendimiento**:
   - Inserción bulk en bases de datos (más eficiente que múltiples queries)
   - Procesamiento paralelo para lotes grandes
   - Logging selectivo para balancear rastreabilidad y rendimiento
