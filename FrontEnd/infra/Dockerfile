# Node 환경에서 프로젝트 빌드
FROM node:22-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . .
RUN npm run build

# Nginx로 정적 파일 서빙
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]