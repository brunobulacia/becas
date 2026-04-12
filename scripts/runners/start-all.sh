#!/bin/bash

# =============================================
# Script para levantar todo el sistema UniBecas
# =============================================

# Colores para los mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

# Directorio base (subir dos niveles desde scripts/runners)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   🎓 Sistema UniBecas - Iniciando     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Función para iniciar un microservicio
start_service() {
    local name=$1
    local port=$2
    local dir=$3
    
    echo -e "${YELLOW}▶ Iniciando ${name} en puerto ${port}...${NC}"
    cd "$BASE_DIR/unibecas-system/$dir"
    node index.js &
    sleep 1
    echo -e "${GREEN}✓ ${name} iniciado (PID: $!)${NC}"
}

# Función para verificar si un puerto está en uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}⚠ Puerto $1 ya está en uso${NC}"
        return 1
    fi
    return 0
}

# Verificar puertos antes de iniciar
echo -e "${YELLOW}Verificando puertos disponibles...${NC}"
PORTS=(3000 3001 3002 3003 3004 3005 3006 8080)
ALL_PORTS_FREE=true

for port in "${PORTS[@]}"; do
    if ! check_port $port; then
        ALL_PORTS_FREE=false
    fi
done

if [ "$ALL_PORTS_FREE" = false ]; then
    echo ""
    echo -e "${RED}Algunos puertos están en uso. ¿Deseas continuar de todas formas? (s/n)${NC}"
    read -r response
    if [ "$response" != "s" ] && [ "$response" != "S" ]; then
        echo -e "${RED}Abortando...${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}--- Iniciando Microservicios ---${NC}"
echo ""

# Iniciar microservicios
start_service "ms-carrera" 3001 "ms-carrera"
start_service "ms-beca" 3002 "ms-beca"
start_service "ms-estudiante" 3003 "ms-estudiante"
start_service "ms-convocatoria" 3004 "ms-convocatoria"
start_service "ms-solicitud" 3005 "ms-solicitud"
start_service "ms-asignacion" 3006 "ms-asignacion"

echo ""
echo -e "${BLUE}--- Iniciando API Gateway ---${NC}"
echo ""

# Iniciar API Gateway
echo -e "${YELLOW}▶ Iniciando API Gateway en puerto 3000...${NC}"
cd "$BASE_DIR/unibecas-system/api-gateway"
node index.js &
sleep 1
echo -e "${GREEN}✓ API Gateway iniciado (PID: $!)${NC}"

echo ""
echo -e "${BLUE}--- Iniciando Frontend ---${NC}"
echo ""

# Iniciar servidor del frontend (usando Python como servidor HTTP simple)
echo -e "${YELLOW}▶ Iniciando Frontend en puerto 8080...${NC}"
cd "$BASE_DIR/unibecas-web"
python3 -m http.server 8080 &
sleep 1
echo -e "${GREEN}✓ Frontend iniciado (PID: $!)${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   ✅ Sistema UniBecas iniciado        ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}Servicios disponibles:${NC}"
echo -e "  📡 API Gateway:     http://localhost:3000"
echo -e "  🎓 ms-carrera:      http://localhost:3001"
echo -e "  🏆 ms-beca:         http://localhost:3002"
echo -e "  👨‍🎓 ms-estudiante:   http://localhost:3003"
echo -e "  📢 ms-convocatoria: http://localhost:3004"
echo -e "  📝 ms-solicitud:    http://localhost:3005"
echo -e "  ✅ ms-asignacion:   http://localhost:3006"
echo -e "  🌐 Frontend:        http://localhost:8080"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener todos los servicios${NC}"
echo ""

# Guardar PIDs para poder detenerlos después
echo $! > "$BASE_DIR/.pids"

# Función para manejar Ctrl+C
cleanup() {
    echo ""
    echo -e "${YELLOW}Deteniendo todos los servicios...${NC}"
    pkill -f "node.*index.js" 2>/dev/null
    pkill -f "python3 -m http.server 8080" 2>/dev/null
    echo -e "${GREEN}✓ Todos los servicios detenidos${NC}"
    exit 0
}

# Capturar señal de interrupción
trap cleanup SIGINT SIGTERM

# Mantener el script corriendo
wait
