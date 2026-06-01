#!/bin/bash

# =============================================
# Script para detener todo el sistema UniBecas
# =============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Sistema UniBecas - Deteniendo        ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Matar por nombre de clase Java (lo que lanzamos nosotros)
echo -e "${YELLOW}Deteniendo microservicios Java...${NC}"
pkill -f "EstudianteServidor"   2>/dev/null && echo -e "${GREEN}  ms-estudiante detenido${NC}"
pkill -f "CarreraServidor"      2>/dev/null && echo -e "${GREEN}  ms-carrera detenido${NC}"
pkill -f "BecaServidor"         2>/dev/null && echo -e "${GREEN}  ms-beca detenido${NC}"
pkill -f "ConvocatoriaServidor" 2>/dev/null && echo -e "${GREEN}  ms-convocatoria detenido${NC}"
pkill -f "SolicitudServidor"    2>/dev/null && echo -e "${GREEN}  ms-solicitud detenido${NC}"
pkill -f "AsignacionServidor"   2>/dev/null && echo -e "${GREEN}  ms-asignacion detenido${NC}"
pkill -f "ApiGateway"           2>/dev/null && echo -e "${GREEN}  API Gateway detenido${NC}"
pkill -f "python3 -m http.server 8080" 2>/dev/null && echo -e "${GREEN}  Frontend detenido${NC}"

# Forzar por puerto (por si quedo algun proceso zombie)
echo ""
echo -e "${YELLOW}Liberando puertos por si quedan ocupados...${NC}"
for port in 3000 3001 3002 3003 3004 3005 3006 8080; do
    pids=$(lsof -ti :$port 2>/dev/null)
    if [ -n "$pids" ]; then
        kill -9 $pids 2>/dev/null
        echo -e "${GREEN}  Puerto $port liberado${NC}"
    fi
done

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   Todos los servicios detenidos        ${NC}"
echo -e "${BLUE}========================================${NC}"
