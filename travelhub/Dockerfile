
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app


COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests -B


FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar



EXPOSE 8000

ENTRYPOINT ["java", "-jar", "app.jar"]
