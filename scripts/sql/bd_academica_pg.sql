-- =============================================
-- BASE DE DATOS: bd_academica (PostgreSQL)
-- Gestión Académica - CU1 y CU3
-- Tablas: FACULTAD, CARRERA, ESTUDIANTE, CARRERA_ESTUDIANTE
-- =============================================

-- Crear la base de datos (ejecutar como superusuario)
-- CREATE DATABASE bd_academica;
-- \c bd_academica

-- =============================================
-- TABLA: FACULTAD
-- =============================================
CREATE TABLE FACULTAD (
    ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(255) NOT NULL
);

-- =============================================
-- TABLA: CARRERA
-- =============================================
CREATE TABLE CARRERA (
    ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(255) NOT NULL,
    ID_FACULTAD INT NOT NULL,
    CONSTRAINT fk_carrera_facultad 
        FOREIGN KEY (ID_FACULTAD) 
        REFERENCES FACULTAD(ID) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================
-- TABLA: ESTUDIANTE
-- =============================================
CREATE TABLE ESTUDIANTE (
    ID SERIAL PRIMARY KEY,
    CODIGOP INT NOT NULL UNIQUE,
    NOMBRE VARCHAR(255) NOT NULL,
    APELLIDO VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL UNIQUE,
    PPA DECIMAL(5,2) NOT NULL,
    ACTIVO BOOLEAN NOT NULL DEFAULT TRUE
);

-- =============================================
-- TABLA: CARRERA_ESTUDIANTE (Tabla intermedia)
-- =============================================
CREATE TABLE CARRERA_ESTUDIANTE (
    ID_CARRERA INT NOT NULL,
    ID_ESTUDIANTE INT NOT NULL,
    FECHA_INSCRIPCION DATE NOT NULL,
    PRIMARY KEY (ID_CARRERA, ID_ESTUDIANTE),
    CONSTRAINT fk_ce_carrera 
        FOREIGN KEY (ID_CARRERA) 
        REFERENCES CARRERA(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_ce_estudiante 
        FOREIGN KEY (ID_ESTUDIANTE) 
        REFERENCES ESTUDIANTE(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================
-- ÍNDICES para mejorar rendimiento
-- =============================================
CREATE INDEX idx_carrera_facultad ON CARRERA(ID_FACULTAD);
CREATE INDEX idx_ce_carrera ON CARRERA_ESTUDIANTE(ID_CARRERA);
CREATE INDEX idx_ce_estudiante ON CARRERA_ESTUDIANTE(ID_ESTUDIANTE);
CREATE INDEX idx_estudiante_email ON ESTUDIANTE(EMAIL);
CREATE INDEX idx_estudiante_codigop ON ESTUDIANTE(CODIGOP);

-- =============================================
-- DATOS DE PRUEBA (opcional)
-- =============================================
INSERT INTO FACULTAD (NOMBRE) VALUES 
    ('Facultad de Ingeniería'),
    ('Facultad de Ciencias Económicas'),
    ('Facultad de Medicina'),
    ('Facultad de Derecho');

INSERT INTO CARRERA (NOMBRE, ID_FACULTAD) VALUES 
    ('Ingeniería de Sistemas', 1),
    ('Ingeniería Civil', 1),
    ('Ingeniería Industrial', 1),
    ('Administración de Empresas', 2),
    ('Contaduría Pública', 2),
    ('Medicina General', 3),
    ('Enfermería', 3),
    ('Derecho', 4);

INSERT INTO ESTUDIANTE (CODIGOP, NOMBRE, APELLIDO, EMAIL, PPA, ACTIVO) VALUES 
    (20210001, 'Juan', 'Pérez', 'juan.perez@universidad.edu', 85.50, TRUE),
    (20210002, 'María', 'González', 'maria.gonzalez@universidad.edu', 92.30, TRUE),
    (20210003, 'Carlos', 'López', 'carlos.lopez@universidad.edu', 78.00, TRUE),
    (20210004, 'Ana', 'Martínez', 'ana.martinez@universidad.edu', 88.75, TRUE),
    (20210005, 'Pedro', 'Rodríguez', 'pedro.rodriguez@universidad.edu', 65.00, FALSE);

INSERT INTO CARRERA_ESTUDIANTE (ID_CARRERA, ID_ESTUDIANTE, FECHA_INSCRIPCION) VALUES 
    (1, 1, '2021-02-15'),
    (1, 2, '2021-02-15'),
    (4, 3, '2021-03-01'),
    (6, 4, '2021-02-20'),
    (8, 5, '2020-02-15');
