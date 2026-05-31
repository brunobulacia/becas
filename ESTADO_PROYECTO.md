# Estado del Proyecto — UniBecas (Java Puro)

Documento para agente: describe qué fue hecho, cómo está estructurado, y qué falta para que el sistema funcione.

---

## Resumen del estado actual

El sistema fue migrado de Node.js a **Java puro** (sin frameworks, sin Maven, sin Spring).  
Los archivos `.java` YA EXISTEN en sus carpetas correctas.  
Los archivos `.js` originales **todavía están presentes** (no fueron eliminados).  
El frontend HTML/JS **no necesita cambios** — ya apunta a `http://localhost:3000/api`.

---

## Estructura de carpetas (completa)

```
code/
├── unibecas-system/
│   ├── api-gateway/
│   │   ├── ApiGateway.java          ← clase main, puerto 3000
│   │   ├── api-gateway.js           ← VIEJO (borrar)
│   │   ├── index.js                 ← VIEJO (borrar)
│   │   ├── package.json             ← VIEJO (borrar)
│   │   └── package-lock.json        ← VIEJO (borrar)
│   │
│   ├── ms-carrera/                  ← puerto 3001
│   │   ├── datos/
│   │   │   ├── entidades/
│   │   │   │   ├── Carrera.java
│   │   │   │   └── Facultad.java
│   │   │   ├── CarreraDao.java
│   │   │   ├── FacultadDao.java
│   │   │   └── ConexionBD.java
│   │   ├── negocio/
│   │   │   ├── controlador/
│   │   │   │   ├── CarreraController.java
│   │   │   │   └── CarreraServidor.java   ← tiene el main()
│   │   │   ├── CarreraN.java
│   │   │   └── FacultadN.java
│   │   ├── datos/models/*.js         ← VIEJOS (borrar)
│   │   ├── negocio/controllers/*.js  ← VIEJOS (borrar)
│   │   ├── negocio/routes/*.js       ← VIEJOS (borrar)
│   │   ├── db.js                     ← VIEJO (borrar)
│   │   ├── index.js                  ← VIEJO (borrar)
│   │   └── package.json              ← VIEJO (borrar)
│   │
│   ├── ms-beca/                     ← puerto 3002
│   │   ├── datos/
│   │   │   ├── entidades/
│   │   │   │   ├── Beca.java
│   │   │   │   └── TipoBeca.java
│   │   │   ├── BecaDao.java
│   │   │   ├── TipoBecaDao.java
│   │   │   └── ConexionBD.java
│   │   └── negocio/
│   │       ├── controlador/
│   │       │   ├── BecaController.java
│   │       │   └── BecaServidor.java      ← tiene el main()
│   │       ├── BecaN.java
│   │       └── TipoBecaN.java
│   │
│   ├── ms-estudiante/               ← puerto 3003
│   │   ├── datos/
│   │   │   ├── entidades/
│   │   │   │   ├── Estudiante.java
│   │   │   │   └── CarreraEstudiante.java
│   │   │   ├── EstudianteDao.java
│   │   │   ├── CarreraEstudianteDao.java
│   │   │   └── ConexionBD.java
│   │   └── negocio/
│   │       ├── controlador/
│   │       │   ├── EstudianteController.java
│   │       │   └── EstudianteServidor.java  ← tiene el main()
│   │       ├── EstudianteN.java
│   │       └── CarreraEstudianteN.java
│   │
│   ├── ms-convocatoria/             ← puerto 3004
│   │   ├── datos/
│   │   │   ├── entidades/
│   │   │   │   └── Convocatoria.java
│   │   │   ├── ConvocatoriaDao.java
│   │   │   └── ConexionBD.java
│   │   └── negocio/
│   │       ├── controlador/
│   │       │   ├── ConvocatoriaController.java
│   │       │   └── ConvocatoriaServidor.java  ← tiene el main()
│   │       └── ConvocatoriaN.java
│   │
│   ├── ms-solicitud/                ← puerto 3005
│   │   ├── datos/
│   │   │   ├── entidades/
│   │   │   │   └── Solicitud.java
│   │   │   ├── SolicitudDao.java
│   │   │   └── ConexionBD.java
│   │   └── negocio/
│   │       ├── controlador/
│   │       │   ├── SolicitudController.java
│   │       │   └── SolicitudServidor.java   ← tiene el main()
│   │       └── SolicitudN.java
│   │
│   └── ms-asignacion/               ← puerto 3006
│       ├── datos/
│       │   ├── entidades/
│       │   │   └── Asignacion.java
│       │   ├── AsignacionDao.java
│       │   └── ConexionBD.java
│       └── negocio/
│           ├── controlador/
│           │   ├── AsignacionController.java
│           │   └── AsignacionServidor.java  ← tiene el main()
│           └── AsignacionN.java
│
└── unibecas-web/                    ← frontend estático (no cambiar)
    ├── index.html
    ├── js/api.js                    ← ya apunta a http://localhost:3000/api
    ├── js/*.js
    ├── pages/*.html
    └── components/navbar.js
```

---

## Cómo está implementado cada microservicio

### Capas (misma estructura en todos los MS)

| Archivo | Paquete | Rol |
|---|---|---|
| `ConexionBD.java` | `datos` | Abre conexión JDBC a PostgreSQL |
| `[Entidad].java` | `datos.entidades` | POJO: campos, getters, setters, `toJson()` |
| `[Entidad]Dao.java` | `datos` | SQL via JDBC: getAll, getById, create, update, delete |
| `[Entidad]N.java` | `negocio` | Lógica de negocio, llama al Dao, mapea Map→Entidad |
| `[Entidad]Controller.java` | `negocio.controlador` | Maneja HTTP: parsea URL, llama N, responde JSON |
| `[Entidad]Servidor.java` | `negocio.controlador` | Tiene `main()`, crea `HttpServer`, registra contextos |

### Tecnologías usadas (Java puro)
- **HTTP server**: `com.sun.net.httpserver.HttpServer` (incluido en el JDK, no necesita dependencias)
- **Base de datos**: JDBC con driver PostgreSQL (JAR externo — ver pendientes)
- **JSON**: construido manualmente con String/StringBuilder (no hay librería)
- **JSON parsing**: regex en `parseBody()` dentro de cada Controller

### Base de datos
- Host: `localhost:5432`
- Usuario: `postgres`
- Contraseña: `BRUNO6464`
- Base: `bd_postulacion`
- La contraseña está hardcodeada en cada `ConexionBD.java`

### Comunicación entre microservicios
Dos MS hacen llamadas HTTP internas a `ms-estudiante` (puerto 3003):
- `ms-solicitud` → llama a `/estudiantes/{id}` para enriquecer la respuesta con nombre del estudiante
- `ms-asignacion` → igual

Esto se hace en las clases `SolicitudN.java` y `AsignacionN.java` usando `HttpURLConnection`.

---

## Rutas del API Gateway (puerto 3000)

El frontend usa `http://localhost:3000/api/...` y el gateway hace proxy a:

| Ruta gateway | Microservicio | Puerto |
|---|---|---|
| `/api/facultades` | ms-carrera | 3001 |
| `/api/carreras` | ms-carrera | 3001 |
| `/api/tipos-beca` | ms-beca | 3002 |
| `/api/becas` | ms-beca | 3002 |
| `/api/estudiantes` | ms-estudiante | 3003 |
| `/api/convocatorias` | ms-convocatoria | 3004 |
| `/api/solicitudes` | ms-solicitud | 3005 |
| `/api/asignaciones` | ms-asignacion | 3006 |

El gateway quita el prefijo `/api` antes de reenviar. Ej: `/api/carreras/1` → `/carreras/1` en el MS.

---

## Qué falta hacer (TODO para el agente)

### 1. Conseguir el driver PostgreSQL JDBC
El JAR no está en el proyecto. Opciones:
- Descargarlo de: https://jdbc.postgresql.org/download/ (archivo `postgresql-42.x.x.jar`)
- O bajarlo con curl: `curl -L -o postgresql.jar "https://jdbc.postgresql.org/download/postgresql-42.7.4.jar"`
- Colocarlo en una carpeta compartida, ej: `unibecas-system/libs/postgresql.jar`

### 2. Crear scripts de compilación
Crear un script por MS (o uno global). Ejemplo para cada MS desde su raíz:

```bash
#!/bin/bash
# compile.sh (dentro de cada ms-[nombre]/)
JAR=../libs/postgresql.jar
mkdir -p out
javac -cp .:$JAR -d out \
  datos/entidades/*.java \
  datos/*.java \
  negocio/*.java \
  negocio/controlador/*.java
echo "Compilado OK"
```

Para `api-gateway/` (no tiene packages):
```bash
JAR=../libs/postgresql.jar
mkdir -p out
javac -cp .:$JAR -d out ApiGateway.java
```

### 3. Crear scripts de ejecución
```bash
#!/bin/bash
# run.sh (dentro de cada ms-[nombre]/)
JAR=../libs/postgresql.jar
java -cp out:$JAR negocio.controlador.[Nombre]Servidor
```

Para api-gateway:
```bash
java -cp out:$JAR ApiGateway
```

### 4. Crear un script global de arranque
Un script en `unibecas-system/` que compile y levante todos los MS en background:

```bash
#!/bin/bash
# start-all.sh
LIBS="libs/postgresql.jar"

for ms in ms-carrera ms-beca ms-estudiante ms-convocatoria ms-solicitud ms-asignacion; do
  echo "Compilando $ms..."
  cd $ms
  mkdir -p out
  javac -cp .:../$LIBS -d out datos/entidades/*.java datos/*.java negocio/*.java negocio/controlador/*.java
  # ejecutar en background
  java -cp "out:../$LIBS" negocio.controlador.$(ls negocio/controlador/*Servidor.java | xargs -I{} basename {} .java) &
  cd ..
done

# api-gateway
cd api-gateway
mkdir -p out
javac -cp .:../$LIBS -d out ApiGateway.java
java -cp "out:../$LIBS" ApiGateway &
cd ..

echo "Todos los servicios iniciados."
```

### 5. Eliminar archivos Node.js viejos
En cada carpeta de microservicio y api-gateway eliminar:
- `*.js` (index.js, db.js, api-gateway.js, controllers/*.js, routes/*.js, models/*.js)
- `package.json`
- `package-lock.json`
- `node_modules/` (si existe)
- `datos/models/` (subcarpeta vieja)
- `negocio/controllers/` y `negocio/routes/` (subcarpetas viejas)

Comando para limpiar todo:
```bash
# Desde unibecas-system/
for ms in ms-carrera ms-beca ms-estudiante ms-convocatoria ms-solicitud ms-asignacion api-gateway; do
  find $ms -name "*.js" -delete
  find $ms -name "package.json" -delete
  find $ms -name "package-lock.json" -delete
  rm -rf $ms/node_modules
  rm -rf $ms/datos/models        # carpeta vieja JS
  rm -rf $ms/negocio/controllers # carpeta vieja JS
  rm -rf $ms/negocio/routes      # carpeta vieja JS
done
```

### 6. Actualizar .gitignore
Agregar al `.gitignore` existente:
```
# Java compiled output
**/out/
**/*.class
libs/
```

### 7. Verificar que Java 11+ está instalado
Los archivos usan `readAllBytes()` y `List.of()` que requieren Java 11 mínimo.
```bash
java -version  # debe ser 11 o mayor
```

### 8. Verificar la BD antes de levantar
El `ConvocatoriaDao.java` tiene una subquery que referencia la tabla `SOLICITUD`.  
Asegurarse que ambas tablas existen en `bd_postulacion`. Si están en BDs separadas,  
hay que ajustar el SQL de `ConvocatoriaDao.java` para quitar esa subquery.

---

## Orden de arranque recomendado

Levantar los MS en este orden (por dependencias HTTP):

1. `ms-estudiante` (puerto 3003) — otros MS lo consultan
2. `ms-carrera` (3001)
3. `ms-beca` (3002)
4. `ms-convocatoria` (3004)
5. `ms-solicitud` (3005)
6. `ms-asignacion` (3006)
7. `api-gateway` (3000) — último

---

## Formato de respuesta JSON (todos los endpoints)

```json
{ "success": true,  "data": { ... },  "message": "Texto OK" }
{ "success": false, "data": null,     "message": "Texto error" }
```

---

## Notas importantes para el agente

- **No modificar** `unibecas-web/js/api.js` — ya apunta a `localhost:3000/api` (correcto)
- **No usar** Maven, Gradle, Spring, ni ningún framework
- El único JAR externo permitido es el driver JDBC de PostgreSQL
- Cada MS se compila y ejecuta de forma **completamente independiente**
- La contraseña de BD `BRUNO6464` está hardcodeada en cada `ConexionBD.java` — no cambiar
- `ApiGateway.java` no tiene declaración de paquete (default package) — es correcto
- Todos los demás `.java` usan paquetes: `datos`, `datos.entidades`, `negocio`, `negocio.controlador`
