#!/bin/bash

cd "$(dirname "$0")" || exit

docker compose -p frontend -f docker-compose.dev.yml down --remove-orphans

docker compose -p frontend -f docker-compose.dev.yml up -d --build

docker compose -p frontend -f docker-compose.dev.yml ps
