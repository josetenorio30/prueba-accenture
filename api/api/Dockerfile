# Etapa 1: Construcción (compila el código usando Maven)
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compila el proyecto saltando las pruebas para empaquetarlo rápido
RUN mvn clean package -DskipTests 

# Etapa 2: Ejecución (solo usa una imagen ligera de Java para correr la app)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
# Copia el archivo .jar generado en la etapa anterior
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]