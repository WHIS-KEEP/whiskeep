#!/bin/bash

cd "$(dirname "$0")" || exit

docker compose -p backend -f docker-compose.dev.yml down --remove-orphans

docker compose -p backend -f docker-compose.dev.yml up -d --build

docker compose -p backend -f docker-compose.dev.yml ps
