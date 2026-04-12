# CHANGELOG - Arquitectura de Base de Datos

## Cambio: Separación en dos bases de datos independientes

### Contexto

El sistema de Gestión de Becas Universitarias ahora opera con **dos bases de datos separadas**, cada una correspondiente a un microservicio distinto.

### Bases de datos

| Base de datos | Microservicio | Tablas | Casos de uso |
|---|---|---|---|
| `bd_academica` | Gestión Académica | FACULTAD, CARRERA, ESTUDIANTE, CARRERA_ESTUDIANTE | CU1 (Carreras), CU3 (Estudiantes) |
| `bd_postulacion` | Gestión Postulaciones | TIPO_BECA, BECA, CONVOCATORIA, SOLICITUD, ASIGNACION | CU2 (Becas), CU4 (Convocatorias), CU5 (Solicitudes), CU6 (Asignaciones) |

### Cambio clave: SOLICITUD.ID_ESTUDIANTE

La tabla `SOLICITUD` en `bd_postulacion` **mantiene la columna `ID_ESTUDIANTE`**, pero ya **no es una foreign key física** (no puede serlo, porque la tabla ESTUDIANTE vive en otra base de datos).

**Antes (una sola BD):**
```sql
-- FK física apuntando a ESTUDIANTE
FOREIGN KEY (ID_ESTUDIANTE) REFERENCES ESTUDIANTE(ID)
```

**Ahora (dos BDs separadas):**
```sql
-- ID_ESTUDIANTE sigue existiendo como columna INT NOT NULL
-- pero es una LLAVE LÓGICA (sin constraint FK en la BD)
-- La integridad referencial se valida a nivel de aplicación/servicio
ID_ESTUDIANTE INT NOT NULL
-- NO hay FOREIGN KEY — la referencia se resuelve vía API al microservicio de Gestión Académica
```

### Implicaciones para el desarrollo

1. **No hay JOIN entre bases de datos.** Para obtener datos del estudiante desde el módulo de postulaciones, se debe consumir la API del microservicio de Gestión Académica.
2. **Validación por aplicación.** Antes de registrar una solicitud, el servicio de Postulaciones debe verificar que el `ID_ESTUDIANTE` exista y esté activo consultando al servicio de Gestión Académica.
3. **Consistencia eventual.** Si se elimina un estudiante en `bd_academica`, las solicitudes asociadas en `bd_postulacion` no se eliminan automáticamente (no hay CASCADE entre BDs).

### Esquema actualizado de SOLICITUD

```sql
CREATE TABLE SOLICITUD(
    ID INT NOT NULL PRIMARY KEY,
    FECHA_SOLICITUD DATE NOT NULL,
    ESTADO VARCHAR(50) NOT NULL CHECK (ESTADO IN ('PENDIENTE', 'APROBADA', 'RECHAZADA')) DEFAULT 'PENDIENTE',
    OBSERVACIONES TEXT,
    ID_ESTUDIANTE INT NOT NULL,        -- Llave lógica → ESTUDIANTE.ID en bd_academica
    ID_CONVOCATORIA INT NOT NULL,
    FOREIGN KEY (ID_CONVOCATORIA) REFERENCES CONVOCATORIA(ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    -- NO FK para ID_ESTUDIANTE (vive en bd_academica)
);
```
