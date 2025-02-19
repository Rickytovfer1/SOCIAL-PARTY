FROM openjdk:18-alpine

WORKDIR /app

COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline

COPY src src
RUN ./mvnw clean package -DskipTests

COPY target/safajobs-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
