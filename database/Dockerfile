FROM mysql:8.0.35
ENV MYSQL_ROOT_PASSWORD=0000
ENV MYSQL_DATABASE=board
ADD ./init_db/* /docker-entrypoint-initdb.d

# 이미지 빌드 명령어 (현 파일과 같은 디렉토리에서)
# docker build -t {이미지명} .

# 실행 명령어 (터미널에 로그 찍히는 것 보기)
# docker run --name {컨테이너명} -it -p 3306:3306 {이미지명}

# 실행 명령어 (데몬으로 실행)
# docker run --name {컨테이너명} -p 3306:3306 -d {이미지명}
