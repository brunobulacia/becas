-- =============================================
-- BASE DE DATOS: bd_postulacion (PostgreSQL)
-- Gestión Postulaciones - CU2, CU4, CU5, CU6
-- Tablas: TIPO_BECA, BECA, CONVOCATORIA, SOLICITUD, ASIGNACION
-- =============================================

-- Crear la base de datos (ejecutar como superusuario)
-- CREATE DATABASE bd_postulacion;
-- \c bd_postulacion

-- =============================================
-- TABLA: TIPO_BECA
-- =============================================
CREATE TABLE TIPO_BECA (
    ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(255) NOT NULL
);

-- =============================================
-- TABLA: BECA
-- =============================================
CREATE TABLE BECA (
    ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(255) NOT NULL,
    DESCRIPCION TEXT,
    PORCENTAJE DECIMAL(5,2) NOT NULL,
    ACTIVO BOOLEAN NOT NULL DEFAULT TRUE,
    ID_TIPOB INT NOT NULL,
    CONSTRAINT fk_beca_tipo 
        FOREIGN KEY (ID_TIPOB) 
        REFERENCES TIPO_BECA(ID) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================
-- TABLA: CONVOCATORIA
-- =============================================
CREATE TABLE CONVOCATORIA (
    ID SERIAL PRIMARY KEY,
    DESCRIPCION TEXT,
    PERIODO VARCHAR(255) NOT NULL,
    FECHA_INICIO DATE NOT NULL,
    FECHA_FIN DATE NOT NULL,
    CUPOS INT NOT NULL,
    ID_BECA INT NOT NULL,
    CONSTRAINT fk_convocatoria_beca 
        FOREIGN KEY (ID_BECA) 
        REFERENCES BECA(ID) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================
-- TABLA: SOLICITUD
-- Nota: ID_ESTUDIANTE es una llave lógica (no FK física)
-- El estudiante existe en bd_academica, se valida vía API
-- =============================================
CREATE TABLE SOLICITUD (
    ID SERIAL PRIMARY KEY,
    FECHA_SOLICITUD DATE NOT NULL,
    ESTADO VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE',
    OBSERVACIONES TEXT,
    ID_ESTUDIANTE INT NOT NULL,  -- Llave lógica → ESTUDIANTE.ID en bd_academica
    ID_CONVOCATORIA INT NOT NULL,
    CONSTRAINT chk_estado 
        CHECK (ESTADO IN ('PENDIENTE', 'APROBADA', 'RECHAZADA')),
    CONSTRAINT fk_solicitud_convocatoria 
        FOREIGN KEY (ID_CONVOCATORIA) 
        REFERENCES CONVOCATORIA(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    -- NO hay FK para ID_ESTUDIANTE (vive en bd_academica)
);

-- =============================================
-- TABLA: ASIGNACION
-- =============================================
CREATE TABLE ASIGNACION (
    ID SERIAL PRIMARY KEY,
    DESCRIPCION TEXT,
    PERIODO VARCHAR(255) NOT NULL,
    FECHA_INICIO DATE NOT NULL,
    FECHA_FIN DATE NOT NULL,
    ID_SOLICITUD INT NOT NULL,
    CONSTRAINT fk_asignacion_solicitud 
        FOREIGN KEY (ID_SOLICITUD) 
        REFERENCES SOLICITUD(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================
-- ÍNDICES para mejorar rendimiento
-- =============================================
CREATE INDEX idx_beca_tipo ON BECA(ID_TIPOB);
CREATE INDEX idx_convocatoria_beca ON CONVOCATORIA(ID_BECA);
CREATE INDEX idx_solicitud_estudiante ON SOLICITUD(ID_ESTUDIANTE);
CREATE INDEX idx_solicitud_convocatoria ON SOLICITUD(ID_CONVOCATORIA);
CREATE INDEX idx_solicitud_estado ON SOLICITUD(ESTADO);
CREATE INDEX idx_asignacion_solicitud ON ASIGNACION(ID_SOLICITUD);

-- =============================================
-- DATOS DE PRUEBA (opcional)
-- =============================================
INSERT INTO TIPO_BECA (NOMBRE) VALUES 
    ('Académica'),
    ('Deportiva'),
    ('Socioeconómica'),
    ('Cultural');

INSERT INTO BECA (NOMBRE, DESCRIPCION, PORCENTAJE, ACTIVO, ID_TIPOB) VALUES 
    ('Beca Excelencia Académica', 'Para estudiantes con PPA superior a 90', 100.00, TRUE, 1),
    ('Beca Mérito Académico', 'Para estudiantes con PPA superior a 80', 50.00, TRUE, 1),
    ('Beca Deportista Destacado', 'Para atletas de alto rendimiento', 75.00, TRUE, 2),
    ('Beca Apoyo Social', 'Para estudiantes de bajos recursos', 80.00, TRUE, 3),
    ('Beca Talento Cultural', 'Para artistas y músicos destacados', 60.00, TRUE, 4);

INSERT INTO CONVOCATORIA (DESCRIPCION, PERIODO, FECHA_INICIO, FECHA_FIN, CUPOS, ID_BECA) VALUES 
    ('Convocatoria Excelencia 2024-1', '2024-1', '2024-01-15', '2024-02-15', 10, 1),
    ('Convocatoria Mérito 2024-1', '2024-1', '2024-01-15', '2024-02-28', 25, 2),
    ('Convocatoria Deportiva 2024-1', '2024-1', '2024-01-20', '2024-03-01', 15, 3),
    ('Convocatoria Social 2024-1', '2024-1', '2024-02-01', '2024-03-15', 50, 4);

-- Nota: Las solicitudes referencian ID_ESTUDIANTE que existe en bd_academica
INSERT INTO SOLICITUD (FECHA_SOLICITUD, ESTADO, OBSERVACIONES, ID_ESTUDIANTE, ID_CONVOCATORIA) VALUES 
    ('2024-01-20', 'APROBADA', 'Estudiante con excelente rendimiento', 2, 1),
    ('2024-01-25', 'PENDIENTE', 'En revisión de documentos', 1, 2),
    ('2024-02-01', 'RECHAZADA', 'No cumple con requisitos mínimos', 5, 4),
    ('2024-02-05', 'APROBADA', 'Cumple todos los requisitos', 4, 2);

INSERT INTO ASIGNACION (DESCRIPCION, PERIODO, FECHA_INICIO, FECHA_FIN, ID_SOLICITUD) VALUES 
    ('Asignación Beca Excelencia', '2024-1', '2024-03-01', '2024-07-31', 1),
    ('Asignación Beca Mérito', '2024-1', '2024-03-01', '2024-07-31', 4);
