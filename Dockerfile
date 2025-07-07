# Dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8282
ENTRYPOINT ["java","-jar","/app/app.jar"]