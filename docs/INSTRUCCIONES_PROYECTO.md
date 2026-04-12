# INSTRUCCIONES PARA GENERAR EL PROYECTO: Sistema de Gestión de Becas - Microservicios

## 1. DESCRIPCIÓN GENERAL

Software de Gestión de Becas Universitarias con arquitectura de **microservicios**.

**Stack tecnológico:**
- **Backend:** Node.js puro (sin frameworks como Express ni similares, usar `http` nativo de Node.js)
- **Frontend:** HTML5, CSS con Tailwind CDN, JavaScript Vanilla
- **Base de datos:** MySQL
- **Arquitectura:** Microservicios con API Gateway

**Carpeta raíz del proyecto:** `Nodejs/`

---

## 2. ESTRUCTURA DE CARPETAS

```
Nodejs/
├── unibecas-web/                  # Frontend completo
│   ├── index.html                 # Dashboard principal
│   ├── pages/
│   │   ├── carreras.html
│   │   ├── becas.html
│   │   ├── estudiantes.html
│   │   ├── convocatorias.html
│   │   ├── solicitudes.html
│   │   └── asignaciones.html
│   ├── js/
│   │   ├── api.js                 # Cliente HTTP centralizado (fetch al API Gateway)
│   │   ├── carreras.js
│   │   ├── becas.js
│   │   ├── estudiantes.js
│   │   ├── convocatorias.js
│   │   ├── solicitudes.js
│   │   └── asignaciones.js
│   └── components/
│       └── navbar.js              # Navbar reutilizable
│
├── unibecas-system/               # Backend - Microservicios
│   ├── api-gateway/
│   │   ├── package.json
│   │   ├── index.js
│   │   └── gateway.js             # Lógica de proxy/routing
│   │
│   ├── ms-carrera/
│   │   ├── package.json
│   │   ├── index.js               # Servidor HTTP (puerto 3001)
│   │   ├── db.js                  # Conexión MySQL
│   │   ├── routes/
│   │   │   ├── facultad.routes.js
│   │   │   └── carrera.routes.js
│   │   └── controllers/
│   │       ├── facultad.controller.js
│   │       └── carrera.controller.js
│   │
│   ├── ms-beca/
│   │   ├── package.json
│   │   ├── index.js               # Puerto 3002
│   │   ├── db.js
│   │   ├── routes/
│   │   │   ├── tipo-beca.routes.js
│   │   │   └── beca.routes.js
│   │   └── controllers/
│   │       ├── tipo-beca.controller.js
│   │       └── beca.controller.js
│   │
│   ├── ms-estudiante/
│   │   ├── package.json
│   │   ├── index.js               # Puerto 3003
│   │   ├── db.js
│   │   ├── routes/
│   │   │   ├── estudiante.routes.js
│   │   │   └── carrera-estudiante.routes.js
│   │   └── controllers/
│   │       ├── estudiante.controller.js
│   │       └── carrera-estudiante.controller.js
│   │
│   ├── ms-convocatoria/
│   │   ├── package.json
│   │   ├── index.js               # Puerto 3004
│   │   ├── db.js
│   │   ├── routes/
│   │   │   └── convocatoria.routes.js
│   │   └── controllers/
│   │       └── convocatoria.controller.js
│   │
│   ├── ms-solicitud/
│   │   ├── package.json
│   │   ├── index.js               # Puerto 3005
│   │   ├── db.js
│   │   ├── routes/
│   │   │   └── solicitud.routes.js
│   │   └── controllers/
│   │       └── solicitud.controller.js
│   │
│   └── ms-asignacion/
│       ├── package.json
│       ├── index.js               # Puerto 3006
│       ├── db.js
│       ├── routes/
│       │   └── asignacion.routes.js
│       └── controllers/
│           └── asignacion.controller.js
│
└── schema.sql                     # Script de creación de BD
```

---

## 3. BASE DE DATOS

Nombre de la BD: `db_unibecas`

### Schema completo (ejecutar en MySQL):

```sql
CREATE DATABASE IF NOT EXISTS db_unibecas;
USE db_unibecas;

CREATE TABLE FACULTAD (
   ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   NOMBRE VARCHAR(255) NOT NULL
);

CREATE TABLE TIPO_BECA (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(255) NOT NULL
);

CREATE TABLE CARRERA (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(255) NOT NULL,
    ID_FACULTAD INT NOT NULL,
    FOREIGN KEY (ID_FACULTAD) REFERENCES FACULTAD(ID) 
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE BECA (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(255) NOT NULL,
    DESCRIPCION TEXT,
    PORCENTAJE DECIMAL(5,2) NOT NULL,
    ACTIVO BOOLEAN NOT NULL DEFAULT TRUE,
    ID_TIPOB INT NOT NULL,
    FOREIGN KEY (ID_TIPOB) REFERENCES TIPO_BECA(ID) 
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE ESTUDIANTE (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    CODIGOP INT NOT NULL UNIQUE,
    NOMBRE VARCHAR(255) NOT NULL,
    APELLIDO VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL UNIQUE,
    PPA DECIMAL(5,2) NOT NULL,
    ACTIVO BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE CARRERA_ESTUDIANTE(
    ID_CARRERA INT NOT NULL,
    ID_ESTUDIANTE INT NOT NULL,
    FECHA_INSCRIPCION DATE NOT NULL,
    PRIMARY KEY (ID_CARRERA, ID_ESTUDIANTE),
    FOREIGN KEY (ID_CARRERA) REFERENCES CARRERA(ID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ID_ESTUDIANTE) REFERENCES ESTUDIANTE(ID)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE CONVOCATORIA(
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    DESCRIPCION TEXT,
    PERIODO VARCHAR(255) NOT NULL,
    FECHA_INICIO DATE NOT NULL,
    FECHA_FIN DATE NOT NULL,
    CUPOS INT NOT NULL,
    ID_BECA INT NOT NULL,
    FOREIGN KEY (ID_BECA) REFERENCES BECA(ID) 
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE SOLICITUD(
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FECHA_SOLICITUD DATE NOT NULL,
    ESTADO VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE' CHECK (ESTADO IN ('PENDIENTE', 'APROBADA', 'RECHAZADA')),
    OBSERVACIONES TEXT,
    ID_ESTUDIANTE INT NOT NULL,
    ID_CONVOCATORIA INT NOT NULL,
    FOREIGN KEY (ID_ESTUDIANTE) REFERENCES ESTUDIANTE(ID) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ID_CONVOCATORIA) REFERENCES CONVOCATORIA(ID) 
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ASIGNACION(
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    DESCRIPCION TEXT,
    PERIODO VARCHAR(255) NOT NULL,
    FECHA_INICIO DATE NOT NULL,
    FECHA_FIN DATE NOT NULL,
    ID_SOLICITUD INT NOT NULL,
    FOREIGN KEY (ID_SOLICITUD) REFERENCES SOLICITUD(ID) 
    ON DELETE CASCADE ON UPDATE CASCADE
);
```

> **NOTA:** Se usa `AUTO_INCREMENT` en lugar de `INT` manual para las PKs para facilitar los inserts.

---

## 4. CONFIGURACIÓN DE CADA MICROSERVICIO

Cada microservicio es un proyecto Node.js independiente. Ejecutar `npm init -y` en cada carpeta y luego `npm install mysql2`.

### Puertos asignados:

| Microservicio     | Puerto |
|-------------------|--------|
| api-gateway       | 3000   |
| ms-carrera        | 3001   |
| ms-beca           | 3002   |
| ms-estudiante     | 3003   |
| ms-convocatoria   | 3004   |
| ms-solicitud      | 3005   |
| ms-asignacion     | 3006   |

### Dependencia única por microservicio:
- `mysql2` (para la conexión a MySQL)

### Archivo `db.js` (igual en todos los microservicios):

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',       // Ajustar según configuración local
    database: 'db_unibecas',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
```

---

## 5. PATRÓN DE CADA MICROSERVICIO

### 5.1 Archivo `index.js` (servidor HTTP nativo)

Cada microservicio usa el módulo `http` nativo de Node.js. NO usar Express ni ningún framework.

```javascript
const http = require('http');
const { router } = require('./routes/NOMBRE.routes');

const PORT = 300X;

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    await router(req, res);
});

server.listen(PORT, () => {
    console.log(`ms-NOMBRE corriendo en puerto ${PORT}`);
});
```

### 5.2 Archivo de rutas (routes)

Parsear la URL y el método HTTP manualmente para enrutar a los controllers.

Patrón de rutas REST por entidad:

| Método | Ruta              | Acción  |
|--------|--------------------|---------|
| GET    | /entidad           | Listar  |
| GET    | /entidad/:id       | Obtener |
| POST   | /entidad           | Crear   |
| PUT    | /entidad/:id       | Actualizar |
| DELETE | /entidad/:id       | Eliminar |

### 5.3 Controllers

Cada controller ejecuta las queries SQL usando `mysql2/promise` y devuelve JSON.

Patrón de respuesta estándar:

```javascript
// Éxito
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ success: true, data: resultado }));

// Error
res.writeHead(500, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ success: false, message: 'Error mensaje' }));

// No encontrado
res.writeHead(404, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ success: false, message: 'No encontrado' }));
```

Helper para parsear el body de POST/PUT:

```javascript
function getBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve({});
            }
        });
    });
}
```

---

## 6. DETALLE POR MICROSERVICIO

### 6.1 ms-carrera (Puerto 3001)

**Tablas:** FACULTAD, CARRERA

**Rutas de FACULTAD:**
- `GET /facultades` → Listar todas
- `GET /facultades/:id` → Obtener por ID
- `POST /facultades` → Crear (body: `{ nombre }`)
- `PUT /facultades/:id` → Actualizar (body: `{ nombre }`)
- `DELETE /facultades/:id` → Eliminar

**Rutas de CARRERA:**
- `GET /carreras` → Listar todas (JOIN con FACULTAD para traer el nombre de la facultad)
- `GET /carreras/:id` → Obtener por ID
- `POST /carreras` → Crear (body: `{ nombre, id_facultad }`)
- `PUT /carreras/:id` → Actualizar (body: `{ nombre, id_facultad }`)
- `DELETE /carreras/:id` → Eliminar

**Query importante para listar carreras:**
```sql
SELECT c.*, f.NOMBRE AS facultad_nombre 
FROM CARRERA c 
JOIN FACULTAD f ON c.ID_FACULTAD = f.ID
```

---

### 6.2 ms-beca (Puerto 3002)

**Tablas:** TIPO_BECA, BECA

**Rutas de TIPO_BECA:**
- `GET /tipos-beca` → Listar todos
- `GET /tipos-beca/:id` → Obtener por ID
- `POST /tipos-beca` → Crear (body: `{ nombre }`)
- `PUT /tipos-beca/:id` → Actualizar (body: `{ nombre }`)
- `DELETE /tipos-beca/:id` → Eliminar

**Rutas de BECA:**
- `GET /becas` → Listar todas (JOIN con TIPO_BECA)
- `GET /becas/:id` → Obtener por ID
- `POST /becas` → Crear (body: `{ nombre, descripcion, porcentaje, activo, id_tipob }`)
- `PUT /becas/:id` → Actualizar
- `DELETE /becas/:id` → Eliminar

**Query para listar becas:**
```sql
SELECT b.*, tb.NOMBRE AS tipo_nombre 
FROM BECA b 
JOIN TIPO_BECA tb ON b.ID_TIPOB = tb.ID
```

---

### 6.3 ms-estudiante (Puerto 3003)

**Tablas:** ESTUDIANTE, CARRERA_ESTUDIANTE

**Rutas de ESTUDIANTE:**
- `GET /estudiantes` → Listar todos
- `GET /estudiantes/:id` → Obtener por ID (incluir las carreras del estudiante)
- `POST /estudiantes` → Crear (body: `{ codigop, nombre, apellido, email, ppa, activo, carreras: [{ id_carrera, fecha_inscripcion }] }`)
- `PUT /estudiantes/:id` → Actualizar
- `DELETE /estudiantes/:id` → Eliminar

**Rutas de CARRERA_ESTUDIANTE:**
- `GET /estudiantes/:id/carreras` → Listar carreras de un estudiante
- `POST /estudiantes/:id/carreras` → Inscribir en carrera (body: `{ id_carrera, fecha_inscripcion }`)
- `DELETE /estudiantes/:id/carreras/:id_carrera` → Desinscribir

**Query para listar estudiantes con carrera:**
```sql
SELECT e.*, GROUP_CONCAT(c.NOMBRE) AS carreras
FROM ESTUDIANTE e
LEFT JOIN CARRERA_ESTUDIANTE ce ON e.ID = ce.ID_ESTUDIANTE
LEFT JOIN CARRERA c ON ce.ID_CARRERA = c.ID
GROUP BY e.ID
```

---

### 6.4 ms-convocatoria (Puerto 3004)

**Tabla:** CONVOCATORIA

**Rutas:**
- `GET /convocatorias` → Listar todas (JOIN con BECA para nombre de beca)
- `GET /convocatorias/:id` → Obtener por ID
- `POST /convocatorias` → Crear (body: `{ descripcion, periodo, fecha_inicio, fecha_fin, cupos, id_beca }`)
- `PUT /convocatorias/:id` → Actualizar
- `DELETE /convocatorias/:id` → Eliminar

**Query para listar:**
```sql
SELECT co.*, b.NOMBRE AS beca_nombre 
FROM CONVOCATORIA co 
JOIN BECA b ON co.ID_BECA = b.ID
```

---

### 6.5 ms-solicitud (Puerto 3005)

**Tabla:** SOLICITUD

**Rutas:**
- `GET /solicitudes` → Listar todas (JOIN con ESTUDIANTE y CONVOCATORIA)
- `GET /solicitudes/:id` → Obtener por ID
- `POST /solicitudes` → Crear (body: `{ fecha_solicitud, observaciones, id_estudiante, id_convocatoria }`) — Estado por defecto: 'PENDIENTE'
- `PUT /solicitudes/:id` → Actualizar (body: `{ estado, observaciones }`)
- `DELETE /solicitudes/:id` → Eliminar

**Query para listar:**
```sql
SELECT s.*, 
    CONCAT(e.NOMBRE, ' ', e.APELLIDO) AS estudiante_nombre,
    e.CODIGOP AS estudiante_codigo,
    co.DESCRIPCION AS convocatoria_nombre,
    co.PERIODO AS convocatoria_periodo
FROM SOLICITUD s
JOIN ESTUDIANTE e ON s.ID_ESTUDIANTE = e.ID
JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID
```

---

### 6.6 ms-asignacion (Puerto 3006)

**Tabla:** ASIGNACION

**Rutas:**
- `GET /asignaciones` → Listar todas (JOIN con SOLICITUD, ESTUDIANTE, CONVOCATORIA, BECA)
- `GET /asignaciones/:id` → Obtener por ID
- `POST /asignaciones` → Crear (body: `{ descripcion, periodo, fecha_inicio, fecha_fin, id_solicitud }`)
- `PUT /asignaciones/:id` → Actualizar
- `DELETE /asignaciones/:id` → Eliminar

**Query para listar:**
```sql
SELECT a.*, 
    CONCAT(e.NOMBRE, ' ', e.APELLIDO) AS estudiante_nombre,
    b.NOMBRE AS beca_nombre,
    co.PERIODO AS convocatoria_periodo
FROM ASIGNACION a
JOIN SOLICITUD s ON a.ID_SOLICITUD = s.ID
JOIN ESTUDIANTE e ON s.ID_ESTUDIANTE = e.ID
JOIN CONVOCATORIA co ON s.ID_CONVOCATORIA = co.ID
JOIN BECA b ON co.ID_BECA = b.ID
```

---

## 7. API GATEWAY (Puerto 3000)

El API Gateway actúa como proxy reverso. Recibe TODAS las peticiones del frontend y las redirige al microservicio correspondiente.

**Reglas de enrutamiento por prefijo de URL:**

| Prefijo de URL      | Redirige a         |
|----------------------|--------------------|
| /api/facultades      | localhost:3001     |
| /api/carreras        | localhost:3001     |
| /api/tipos-beca      | localhost:3002     |
| /api/becas           | localhost:3002     |
| /api/estudiantes     | localhost:3003     |
| /api/convocatorias   | localhost:3004     |
| /api/solicitudes     | localhost:3005     |
| /api/asignaciones    | localhost:3006     |

**Lógica del Gateway:**
1. Recibe la petición del frontend en `http://localhost:3000/api/carreras`
2. Elimina el prefijo `/api` → queda `/carreras`
3. Hace proxy de la petición al microservicio correspondiente (`http://localhost:3001/carreras`)
4. Devuelve la respuesta del microservicio al frontend

**Implementación:** Usar el módulo `http` nativo para hacer las peticiones proxy. NO usar librerías externas como `http-proxy`.

```javascript
// Ejemplo simplificado del proxy
const routes = {
    '/api/facultades': 'http://localhost:3001',
    '/api/carreras': 'http://localhost:3001',
    '/api/tipos-beca': 'http://localhost:3002',
    '/api/becas': 'http://localhost:3002',
    '/api/estudiantes': 'http://localhost:3003',
    '/api/convocatorias': 'http://localhost:3004',
    '/api/solicitudes': 'http://localhost:3005',
    '/api/asignaciones': 'http://localhost:3006',
};
```

---

## 8. FRONTEND (unibecas-web)

### 8.1 Tecnologías
- HTML5 semántico
- Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`)
- JavaScript Vanilla (fetch API)
- NO usar frameworks (ni React, ni Vue, ni Angular)

### 8.2 Diseño de la interfaz

**Navbar superior** con las secciones:
- Dashboard
- Estudiantes
- Carreras
- Becas
- Convocatorias
- Solicitudes
- Asignaciones

**Colores principales** (basados en los prototipos del documento):
- Fondo navbar: `bg-gray-900` (oscuro)
- Botón "Nueva/Nuevo": `bg-green-500`
- Botón "Editar": texto con icono
- Botón "Eliminar": texto con icono
- Badges de estado: verde (activa/abierta), rojo (cerrada/rechazada), amarillo (pendiente/borrador)

### 8.3 Archivo `api.js` (Cliente HTTP centralizado)

```javascript
const API_BASE = 'http://localhost:3000/api';

const api = {
    async get(endpoint) {
        const res = await fetch(`${API_BASE}${endpoint}`);
        return res.json();
    },
    async post(endpoint, data) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async put(endpoint, data) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    async delete(endpoint) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE'
        });
        return res.json();
    }
};
```

### 8.4 Funcionalidad por página

Cada página tiene:
1. **Tabla** con la lista de registros
2. **Botón "+ Nuevo"** que abre un modal/formulario
3. **Botones "Editar" y "Eliminar"** por fila
4. **Modal** para crear y editar (reutilizar el mismo modal)
5. **Confirmación** antes de eliminar

### 8.5 Páginas del frontend

**carreras.html:**
- Tabla: ID, Nombre, Facultad, Acciones
- Modal: campos nombre (input text) y facultad (select cargado desde /api/facultades)

**becas.html:**
- Tabla: ID, Nombre, Tipo, Porcentaje, Acciones
- Modal: campos nombre, descripcion, porcentaje, tipo (select cargado desde /api/tipos-beca)
- Badges de color para tipo de beca (académica=azul, social=naranja, deportiva=verde)

**estudiantes.html:**
- Tabla: Código, Nombre, Email, Carrera, PPA, Acciones
- Modal: campos codigop, nombre, apellido, email, ppa, carrera (select)

**convocatorias.html:**
- Tabla: ID, Nombre, Beca, Período, Estado, Acciones
- Modal: campos descripcion, periodo, fecha_inicio, fecha_fin, cupos, beca (select)
- Badges de estado: abierta (verde), cerrada (rojo), borrador (amarillo)

**solicitudes.html:**
- Tabla: ID, Estudiante, Convocatoria, Fecha, Estado, Acciones
- Modal: campos estudiante (select), convocatoria (select), observaciones
- Badges: pendiente (amarillo), aprobada (verde), rechazada (rojo)

**asignaciones.html:**
- Tabla: ID, Solicitud (estudiante + beca), Período, Fecha inicio, Fecha fin, Acciones
- Modal: campos solicitud (select solo aprobadas), descripcion, periodo, fecha_inicio, fecha_fin

---

## 9. INSTRUCCIONES DE EJECUCIÓN

### Paso 1: Crear la base de datos
```bash
mysql -u root -p < schema.sql
```

### Paso 2: Instalar dependencias en cada microservicio
```bash
cd unibecas-system/ms-carrera && npm init -y && npm install mysql2
cd ../ms-beca && npm init -y && npm install mysql2
cd ../ms-estudiante && npm init -y && npm install mysql2
cd ../ms-convocatoria && npm init -y && npm install mysql2
cd ../ms-solicitud && npm init -y && npm install mysql2
cd ../ms-asignacion && npm init -y && npm install mysql2
cd ../api-gateway && npm init -y
```

### Paso 3: Levantar microservicios (cada uno en una terminal)
```bash
cd unibecas-system/ms-carrera && node index.js        # Puerto 3001
cd unibecas-system/ms-beca && node index.js           # Puerto 3002
cd unibecas-system/ms-estudiante && node index.js     # Puerto 3003
cd unibecas-system/ms-convocatoria && node index.js   # Puerto 3004
cd unibecas-system/ms-solicitud && node index.js      # Puerto 3005
cd unibecas-system/ms-asignacion && node index.js     # Puerto 3006
cd unibecas-system/api-gateway && node index.js       # Puerto 3000
```

### Paso 4: Abrir el frontend
Abrir `unibecas-web/index.html` directamente en el navegador o servir con Live Server.

---

## 10. REGLAS IMPORTANTES

1. **NO usar Express ni ningún framework.** Solo `http` nativo de Node.js y `mysql2`.
2. **Cada microservicio tiene su propio `package.json`** con `npm init -y`.
3. **Todos los microservicios comparten la misma base de datos** `db_unibecas` (es una decisión de diseño del proyecto).
4. **CORS** debe estar habilitado en cada microservicio y en el API Gateway.
5. **El frontend solo se comunica con el API Gateway** (puerto 3000), nunca directamente con los microservicios.
6. **Respuestas JSON estandarizadas:** `{ success: true/false, data: [...], message: "..." }`.
7. **IDs con AUTO_INCREMENT** en la BD para simplificar los inserts.
8. **Validaciones básicas** en los controllers: campos requeridos, tipos de datos.
9. **Sin autenticación** por ahora (es un proyecto académico).
10. **Tailwind CSS via CDN** en el frontend, sin proceso de build.
