# 도커파일 생성
FROM openjdk:17
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
# JAR 파일 실행
ENTRYPOINT [ "java", "-jar", "/app.jar"]