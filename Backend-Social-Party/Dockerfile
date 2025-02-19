FROM openjdk:18-alpine as builder

WORKDIR /app

COPY mvnw pom.xml ./
COPY .mvn .mvn
COPY src src
RUN ./mvnw dependency:go-offline
RUN ./mvnw clean package -DskipTests

FROM openjdk:18-alpine

WORKDIR /app
COPY --from=builder /app/target/Backend-Social-Party-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
