#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SYS_DIR="$BASE_DIR/unibecas-system"
LIBS="$SYS_DIR/libs/postgresql.jar"
BUILD="/tmp/unibecas-build"
LOGS="/tmp/unibecas-logs"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Sistema UniBecas - Iniciando         ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ ! -f "$LIBS" ]; then
    echo -e "${RED}ERROR: Falta $LIBS${NC}"
    exit 1
fi

# Verificar puertos
echo -e "${YELLOW}Verificando puertos...${NC}"
OCUPADOS=false
for port in 3000 3001 3002 3003 3004 3005 3006 8080; do
    if lsof -ti :$port >/dev/null 2>&1; then
        echo -e "${RED}  Puerto $port ocupado${NC}"
        OCUPADOS=true
    fi
done

if [ "$OCUPADOS" = true ]; then
    echo -e "${RED}Puertos ocupados. Usa restart-all.sh para reiniciar.${NC}"
    exit 1
fi

echo ""
mkdir -p "$LOGS"

compilar_iniciar() {
    local ms=$1
    local clase=$2
    local OUT="$BUILD/$ms"
    mkdir -p "$OUT"
    echo -e "${YELLOW}  Compilando $ms...${NC}"
    javac -cp ".:$LIBS" -d "$OUT" \
        "$SYS_DIR/$ms/datos/entidades/"*.java \
        "$SYS_DIR/$ms/datos/"*.java \
        "$SYS_DIR/$ms/negocio/"*.java \
        "$SYS_DIR/$ms/negocio/controlador/"*.java \
        > "$LOGS/${ms}-compile.log" 2>&1
    if [ $? -ne 0 ]; then
        echo -e "${RED}  ERROR en $ms — ver $LOGS/${ms}-compile.log${NC}"
        return 1
    fi
    nohup java -cp "$OUT:$LIBS" "$clase" >> "$LOGS/$ms.log" 2>&1 &
    echo -e "${GREEN}  $ms iniciado (PID $!)${NC}"
}

echo -e "${BLUE}--- Iniciando microservicios ---${NC}"
compilar_iniciar ms-estudiante   negocio.controlador.EstudianteServidor
compilar_iniciar ms-carrera      negocio.controlador.CarreraServidor
compilar_iniciar ms-beca         negocio.controlador.BecaServidor
compilar_iniciar ms-convocatoria negocio.controlador.ConvocatoriaServidor
compilar_iniciar ms-solicitud    negocio.controlador.SolicitudServidor
compilar_iniciar ms-asignacion   negocio.controlador.AsignacionServidor

echo ""
echo -e "${BLUE}--- Iniciando API Gateway ---${NC}"
GW_OUT="$BUILD/api-gateway"
mkdir -p "$GW_OUT"
javac -cp ".:$LIBS" -d "$GW_OUT" "$SYS_DIR/api-gateway/ApiGateway.java" >> "$LOGS/api-gateway-compile.log" 2>&1
nohup java -cp "$GW_OUT:$LIBS" ApiGateway >> "$LOGS/api-gateway.log" 2>&1 &
echo -e "${GREEN}  API Gateway iniciado (PID $!)${NC}"

echo ""
echo -e "${BLUE}--- Iniciando Frontend ---${NC}"
nohup python3 -m http.server 8080 --directory "$BASE_DIR/unibecas-web" >> "$LOGS/frontend.log" 2>&1 &
echo -e "${GREEN}  Frontend iniciado (PID $!)${NC}"

echo ""
sleep 2
echo -e "${BLUE}--- Estado final ---${NC}"
for port in 3000 3001 3002 3003 3004 3005 3006 8080; do
    lsof -ti :$port >/dev/null 2>&1 \
        && echo -e "${GREEN}  Puerto $port OK${NC}" \
        || echo -e "${RED}  Puerto $port APAGADO${NC}"
done

echo ""
echo -e "${GREEN}  Sistema listo. Podés cerrar esta terminal.${NC}"
echo -e "${BLUE}========================================${NC}"
