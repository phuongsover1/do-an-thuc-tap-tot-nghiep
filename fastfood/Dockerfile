FROM openjdk:17-jdk-alpine
MAINTAINER Phuong_Nguyen
EXPOSE 443
COPY target/fastfood-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]