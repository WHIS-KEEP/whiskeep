
## 2.1 Nginx(reverse proxy용), Elasticsearch 컨테이너 세팅
compose-nginx 폴더 생성 후  
Dockerfile 작성,
docker-compose-nginx.yml 실행  

nginx.conf 적용

compose-es 폴더 생성 후  
Dockerfile 작성,
docker-compose-es.yml 실행  


## 2.2 Git Clone

```bash
git clone https://lab.ssafy.com/s12-bigdata-recom-sub1/S12P21A409.git
cd [프로젝트 폴더]
```

## 2.3 yaml 변수 설정 (.env 파일)

1. 보안 원칙  

`.env` 파일은 `API Key, DB 접속 정보, AWS 자격 증명` 등 민감 정보를 포함하므로 `.gitignore`에 `.env`를 명시하여 Git 추적 대상에서 제외

2. 운영/CI 환경 관리 방법  

| 구분 | 설명 |
| --- | --- |
| 로컬 개발용 | .env 파일을 직접 작성하여 테스트 |
| Jenkins CI/CD | .env 파일을 Jenkins Credentials에 등록|
| Docker 실행 | docker-compose.yml에서 env_file 또는 environment 항목으로 참조 |

`BackEnd/infra/`에 `.env` 파일 생성 후 [정보](./03env.md) 기입  
`FrontEnd/infra/`에 `.env` 파일 생성 후 [정보](./03env.md) 기입
 
## 2.3 실행
각 폴더에 존재하는 `deploy.sh` 실행

```bash
cd BackEnd/infra
./deploy.sh  

cd FrontEnd/infra
./deploy.sh  
```
