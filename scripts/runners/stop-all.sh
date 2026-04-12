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
echo -e "${BLUE}   🛑 Sistema UniBecas - Deteniendo    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}Deteniendo microservicios...${NC}"
pkill -f "node.*ms-carrera" 2>/dev/null && echo -e "${GREEN}✓ ms-carrera detenido${NC}"
pkill -f "node.*ms-beca" 2>/dev/null && echo -e "${GREEN}✓ ms-beca detenido${NC}"
pkill -f "node.*ms-estudiante" 2>/dev/null && echo -e "${GREEN}✓ ms-estudiante detenido${NC}"
pkill -f "node.*ms-convocatoria" 2>/dev/null && echo -e "${GREEN}✓ ms-convocatoria detenido${NC}"
pkill -f "node.*ms-solicitud" 2>/dev/null && echo -e "${GREEN}✓ ms-solicitud detenido${NC}"
pkill -f "node.*ms-asignacion" 2>/dev/null && echo -e "${GREEN}✓ ms-asignacion detenido${NC}"

echo ""
echo -e "${YELLOW}Deteniendo API Gateway...${NC}"
pkill -f "node.*api-gateway" 2>/dev/null && echo -e "${GREEN}✓ API Gateway detenido${NC}"

echo ""
echo -e "${YELLOW}Deteniendo Frontend...${NC}"
pkill -f "python3 -m http.server 8080" 2>/dev/null && echo -e "${GREEN}✓ Frontend detenido${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   ✅ Todos los servicios detenidos    ${NC}"
echo -e "${BLUE}========================================${NC}"
