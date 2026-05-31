#!/bin/bash
JAR=../libs/postgresql.jar
mkdir -p out
javac -cp ".:$JAR" -d out ApiGateway.java
echo "api-gateway compilado OK"
