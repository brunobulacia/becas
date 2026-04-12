En este archivo te indico el contexto completo de todo el proyecto.

Estoy desarrollando un Software de Gestion de Becas usando la arquitectura de microservicios con Nodejs, Javascript Vanilla, HTML5 y Tailwind. Sin utilizar algun framework frontend, solo lenguajes puros. Nodejs puro tambien vamos a usar.

La carpeta raiz que "Nodejs" que contiene a las otras dos carpetas:
/unibecas-web
/unibecas-system

la carpeta unibecas-web va a alojar todo el codigo frontend del software o sistema.

la carpeta unibecas-system va a alojar todos los 6 microservicios y el api gateway.

a continuación te explico cada carpeta de unibecas-system:

/api-gateway
esta carpeta correrá un servidor propio para centralizar todos los puertos de los microservicios entrantes.

/ms-asignacion
aca alojaremos el CRUD completo de la tabla de ASIGNACION

/ms-beca
CRUD completo de las tablas TIPO_BECA y BECA

/ms-carrera
CRUD completo de las tablas FACULTAD, CARRERA

/ms-convocatoria
CRUD completo de la tabla CONVOCATORIA

/ms-estudiante
CRUD completo de las tablas ESTUDIANTE y CARRERA_ESTUDIANTE

/ms-solicitud
CRUD completo de la tabla SOLICITUD

