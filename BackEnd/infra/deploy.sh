#!/bin/bash
# deploy.sh

# 현재 스크립트가 있는 디렉토리(BackEnd/infra)로 이동
cd "$(dirname "$0")" || exit

# 기존 컨테이너와 orphan 컨테이너 정리
docker compose -p backend -f docker-compose.dev.yml down --remove-orphans

# docker-compose.dev.yml 파일을 이용해 서비스 실행 (백그라운드 실행)
docker compose -p backend -f docker-compose.dev.yml up -d --build

# 실행 후 상태 확인 (옵션)
docker compose -p backend -f docker-compose.dev.yml ps
