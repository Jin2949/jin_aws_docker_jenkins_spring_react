# TOY 프로젝트

## 2023/12/28

- 백엔드 스프링부트 세팅

  - mysql연동
    - **mysql 수동으로 켜고 끄는거 주의**
    - yml파일에 password 설정시 ""string 으로 적어야 들어감.

- 프론트엔드 react세팅
  - 화면 및 SPA 라우터 구현 어려움

- 도커 세팅

  - 백엔드 환경
    - springboot : 3.2.1
    - jdk17

  - 도커환경
    - 버전 24.0.7
    - docker-compose v2.23.3-desktop.2
    - 


  첫번째 한것

  - 도커에 하나씩 올려서 띄우기

  - db -> spring-> react순으로 띄움

  - 순서대로 띄우려고 했는데 db와 spring이 연결이 안되는 상황이 나타났다.

    - 해결 : Docker의 네트워크를 생성해서 두개의 이미지를 같은 네트워크에 띄워서 해결
      - 터미널에서
      - docker network create <네트워크 이름> (docker-network로 명칭함.)
      - docker network ls 명령어 입력하면 docker 네트워크 목록 확인 가능
      - docker network inspect docker-network 로 네트워크에서 실행중인 것들 확인

  - db 

    - dockerfile

    - ```dockerfile
      FROM mysql:8.0.35
      ENV MYSQL_ROOT_PASSWORD=0000
      ENV MYSQL_DATABASE=board
      ADD ./init_db/* /docker-entrypoint-initdb.d
      
      #init_db는 기존의 테이블을 export해서 가져온 sql문이 들어있는 폴더
      
      # 이미지 빌드 명령어 (현 파일과 같은 디렉토리에서)
      # docker build -t {이미지명} .
      docker build -t db-image .
      
      # 실행 명령어 (터미널에 로그 찍히는 것 보기) 네트워크 설정
      # docker run --name {컨테이너명} -it -p 3308:3306 {이미지명}
      docker run -d --name db-container --network docker-network -p 3308:3306 db-image
      ```
    
  - springboot

    - ```yml
      # 자바 yml파일 설정, url에 db-container로 docker가 DNS동적으로 매핑해줌.(db컨테이너 이름 맞춰줘야함.)
      spring:
        datasource:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://db-container:3306/board?allowPublicKeyRetrieval=true&useSSL=false
          username: root
          password: "0000"
      
        thymeleaf:
          cache: false
      
        jpa:
          open-in-view: true
          show-sql: true
          hibernate:
            ddl-auto: update
          properties:
            hibernate.format_sql: true
            dialect: org.hibernate.dialect.MySQL8InnoDBDialect
      ```

    - Dockerfile정의

    - ```dockerfile
      # 도커파일 생성
      FROM openjdk:17
      WORKDIR /app
      # 빌드된 Spring Boot JAR 파일을 복사
      COPY build/libs/toy-0.0.1-SNAPSHOT.jar toydev.jar
      # JAR 파일 실행
      CMD ["java", "-jar", "toydev.jar"]
      
      # jar파일 생성
      ./gradlew build
      
      #명령어 backend 파일에서 
      docker build -t backend-image .
      docker run -d --name backend-container --network docker-network -p 8080:8080 backend-image
      
      #아래 명령어를 통해 spring boot와 mysql컨테이너가 생성한 네트워크가 속하는지 확인.
      docker network inspect docker-network
      ```

  - react

    - Dockerfile정의

    - ```dockerfile
      # 가져올 이미지를 정의
      FROM node:20.10.0
      # 경로 설정하기
      WORKDIR /app
      # package.json 워킹 디렉토리에 복사 (.은 설정한 워킹 디렉토리를 뜻함)
      COPY package.json .
      # 명령어 실행 (의존성 설치)
      RUN npm install
      # 현재 디렉토리의 모든 파일을 도커 컨테이너의 워킹 디렉토리에 복사한다.
      COPY . .
      # 각각의 명령어들은 한줄 한줄씩 캐싱되어 실행된다.
      # package.json의 내용은 자주 바뀌진 않을 거지만
      # 소스 코드는 자주 바뀌는데
      # npm install과 COPY . . 를 동시에 수행하면
      # 소스 코드가 조금 달라질때도 항상 npm install을 수행해서 리소스가 낭비된다.
      
      # # 3000번 포트 노출
      EXPOSE 3000
      
      # npm start 스크립트 실행
      CMD ["npm", "start"]
      
      # 그리고 Dockerfile로 docker 이미지를 빌드해야한다.
      # $ docker build .
      ```

    - .dockerignore정의

    - ```dockerfile
      node_modules
      
      # 명령어 프론트도 네트워크가 같아야하는지 모르겠지만 설정해줌.
      docker build -t front-image .
      # docker run -d -p 3000:3000 --name front-container --network docker-network front-image
      docker run -d -p 3000:3000 --name front-container front-image
      ```
      
    - cors에러 문제 생김

    - ```java
      //백엔드에 config파일 만들어줘서 해결
      package JIN.toy.config;
      
      import org.springframework.context.annotation.Configuration;
      import org.springframework.web.servlet.config.annotation.CorsRegistry;
      import org.springframework.web.servlet.config.annotation.EnableWebMvc;
      import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
      
      @Configuration
      @EnableWebMvc
      public class WebConfig implements WebMvcConfigurer {
      
          @Override
          public void addCorsMappings(CorsRegistry registry) {
              registry.addMapping("/**")
                      .allowedMethods("*")
                      .allowedOrigins("http://localhost:3000");
          }
      }
      ```



## 2023/12/29

도커 한번에 올리고 jenkins로 자동배포까지 서버에 올리기까지 도전

```dockerfile
#docker-compose.yml 아래와 같이 세팅
version: '3'

services:
  database:
    container_name: mysql_db
    image: mysql/mysql-server:5.7
    environment:
      MYSQL_DATABASE: users_db
      MYSQL_ROOT_HOST: '%'
      MYSQL_ROOT_PASSWORD: 1234
      TZ: 'Asia/Seoul'
    ports:
      - "3308:3306"
    volumes:
      - ./mysql/conf.d:/etc/mysql/conf.d # MySQL 설정 파일 위치
    command:
      - "mysqld"
      - "--character-set-server=utf8mb4"
      - "--collation-server=utf8mb4_unicode_ci"
    networks:
      - test_network

  application:
    container_name: docker-compose-test
    restart: on-failure
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql_db:3306/users_db?useSSL=false&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: "root"
      SPRING_DATASOURCE_PASSWORD: "1234"
    depends_on:
      - database
    networks:
      - test_network

  frontend:
    build: ./frontend
    # 연결할 외부 디렉토리 : 컨테이너 내 디렉토리
    volumes:
      - ./frontend:/home/node/app
    ports:
      - "3000:3000"


networks:
  test_network:
```

위 내용들 github에 push

ec2 열기

```bash
#ubuntu 명령어
1. 관리자 권한 부여
sudo su -
2. Docker 설치 및 관련 스크립트 입력
# 업데이트
sudo apt-get update -y

# HTTP 패키지 설치
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common -y

# gpg 키 및 저장소 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository --yes \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# Docker 엔진 설치
sudo apt-get install docker-ce docker-ce-cli containerd.io -y

# 설치 확인
docker -v

# git에서 파일 받아와서 도커로 실행
docker compose up -d
```

프리티어의 경우 npm 설치하다가 램초과되어서 멈춤.

```bash
# 아래 명령어를 통해 이 부족한 부분을 디스크의 일부를 대신 사용하도록 설정해줌 으로써 해결하는 방법이다. 이를 메모리 스왑으로 해결
sudo dd if=/dev/zero of=/mnt/swapfile bs=1M count=2048
sudo mkswap /mnt/swapfile
sudo swapon /mnt/swapfile
# 이렇게 해주면 스왑 메모리가 2GB 잡혀서 메모리 부족으로 빌드가 멈추는 현상은 사라짐. 디스크는 RAM 보다 훨씬 속도가 느리기 때문에 서비스에 퍼포먼스 문제가 발생할 수 있다고 한다. 그래서 이 방법은 임시방편으로 쓰고 사양을 올려야 한다.
```

git에서 가져온 파일을 docker container만 다시 올리면 되는줄 알았으나, docker 컨테이너와 이미지를 다 없애고 다시 compose up을 실행해야 git에서 가져온 파일로 실행됨. 변경이 되지 않는다.

```bash
docker rm -f $(docker ps -qa)
#아래 명령어를 통해 image확인 후 삭제
docker images
docker rmi mysql/mysql-server:5.7
```





