#!/bin/bash
# start-all.sh — Compila y levanta todos los microservicios + api-gateway
# Ejecutar desde unibecas-system/

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
LIBS="libs/postgresql.jar"

declare -A SERVIDORES=(
  [ms-estudiante]="negocio.controlador.EstudianteServidor"
  [ms-carrera]="negocio.controlador.CarreraServidor"
  [ms-beca]="negocio.controlador.BecaServidor"
  [ms-convocatoria]="negocio.controlador.ConvocatoriaServidor"
  [ms-solicitud]="negocio.controlador.SolicitudServidor"
  [ms-asignacion]="negocio.controlador.AsignacionServidor"
)

mkdir -p logs

# Compilar y lanzar microservicios
for ms in ms-estudiante ms-carrera ms-beca ms-convocatoria ms-solicitud ms-asignacion; do
  echo "==> Compilando $ms..."
  cd "$SCRIPT_DIR/$ms"
  mkdir -p out
  javac -cp ".:../$LIBS" -d out \
    datos/entidades/*.java \
    datos/*.java \
    negocio/*.java \
    negocio/controlador/*.java
  echo "==> Iniciando $ms..."
  java -cp "out:../$LIBS" ${SERVIDORES[$ms]} > "$SCRIPT_DIR/logs/$ms.log" 2>&1 &
  echo "    PID $! → $SCRIPT_DIR/logs/$ms.log"
  cd "$SCRIPT_DIR"
done

# Compilar y lanzar api-gateway
echo "==> Compilando api-gateway..."
cd "$SCRIPT_DIR/api-gateway"
mkdir -p out
javac -cp ".:../$LIBS" -d out ApiGateway.java
echo "==> Iniciando api-gateway..."
java -cp "out:../$LIBS" ApiGateway > "$SCRIPT_DIR/logs/api-gateway.log" 2>&1 &
echo "    PID $! → $SCRIPT_DIR/logs/api-gateway.log"
cd "$SCRIPT_DIR"

echo ""
echo "✅ Todos los servicios iniciados."
echo "   Frontend: abrir unibecas-web/index.html en el navegador"
echo "   Logs en:  $SCRIPT_DIR/logs/"
