FROM openjdk:8
COPY /target/questionManagement-0.0.1-SNAPSHOT.jar app.jar  
ENTRYPOINT ["java","-jar","app.jar"]

# FROM openjdk:8
# COPY target/questionManagement-0.0.1-SNAPSHOT.jar app.jar  
# ENTRYPOINT ["java","-jar","app.jar"]

# FROM maven:3-jdk-8 AS build
# WORKDIR /app
# COPY . .
# RUN mvn clean package -DskipTests

# FROM openjdk:8
# COPY --from=build /app/target/questionManagement-0.0.1-SNAPSHOT.jar app.jar  
# ENTRYPOINT ["java","-jar","app.jar"]

# FROM openjdk:8-jdk-alpine as build

# # Set the current working directory inside the image
# WORKDIR /app

# # Copy maven executable to the image
# COPY mvnw .
# COPY .mvn .mvn

# # Copy the pom.xml file
# COPY pom.xml .

# # Handles running from Windows
# RUN dos2unix ./mvnw

# # Build all the dependencies in preparation to go offline. 
# # This is a separate step so the dependencies will be cached unless 
# # the pom.xml file has changed.
# RUN ./mvnw dependency:go-offline -B

# # Copy the project source
# COPY src src

# # Package the application
# RUN ./mvnw package -DskipTests
# RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# #### Stage 2: A minimal docker image with command to run the app 
# FROM openjdk:8-jre-alpine

# ARG DEPENDENCY=/app/target/dependency

# # Copy project dependencies from the build stage
# COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
# COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
# COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# ENTRYPOINT ["java","-cp","app:app/lib/*","baylor.csi.questionManagement.QuestionManagementApplication"]
