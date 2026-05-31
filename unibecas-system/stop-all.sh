#!/bin/bash
# stop-all.sh — Detiene todos los procesos Java del sistema UniBecas
# Ejecutar desde unibecas-system/

echo "Deteniendo microservicios Java..."
pkill -f "negocio.controlador.EstudianteServidor"  2>/dev/null && echo "ms-estudiante detenido"
pkill -f "negocio.controlador.CarreraServidor"     2>/dev/null && echo "ms-carrera detenido"
pkill -f "negocio.controlador.BecaServidor"        2>/dev/null && echo "ms-beca detenido"
pkill -f "negocio.controlador.ConvocatoriaServidor"2>/dev/null && echo "ms-convocatoria detenido"
pkill -f "negocio.controlador.SolicitudServidor"   2>/dev/null && echo "ms-solicitud detenido"
pkill -f "negocio.controlador.AsignacionServidor"  2>/dev/null && echo "ms-asignacion detenido"
pkill -f "ApiGateway"                              2>/dev/null && echo "api-gateway detenido"
echo "Listo."
