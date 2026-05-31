#!/bin/bash
JAR=../libs/postgresql.jar
mkdir -p out
javac -cp ".:$JAR" -d out \
  datos/entidades/*.java \
  datos/*.java \
  negocio/*.java \
  negocio/controlador/*.java
echo "ms-convocatoria compilado OK"
