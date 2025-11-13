# Dockerfile para Backend (Spring Boot)
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copiar archivos de Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Descargar dependencias (se cachea si pom.xml no cambia)
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copiar código fuente
COPY src src

# Compilar la aplicación
RUN ./mvnw clean package -DskipTests

# Etapa final - imagen ligera
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR compilado desde la etapa build
COPY --from=build /app/target/*.jar app.jar

# Puerto de la aplicación
EXPOSE 8080

# Variables de entorno por defecto (se pueden sobrescribir en docker-compose)
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Ejecutar la aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
