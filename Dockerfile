FROM openjdk:17-jdk-slim
ARG JAR_FILE=target/frontend-1.0.0.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8282
ENTRYPOINT ["java","-jar","/app.jar"]