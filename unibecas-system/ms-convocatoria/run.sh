#!/bin/bash
JAR=../libs/postgresql.jar
java -cp "out:$JAR" negocio.controlador.ConvocatoriaServidor
