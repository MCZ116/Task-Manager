# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and the src directory to the container
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    mvn dependency:go-offline

COPY . .

RUN mvn package

EXPOSE 8080

CMD ["java", "-jar", "target/task-manager-0.0.1-SNAPSHOT.jar"]
