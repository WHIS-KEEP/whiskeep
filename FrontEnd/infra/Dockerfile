# Node 환경에서 프로젝트 빌드
FROM node:22 as builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN rm -rf node_modules package-lock.json && npm cache clean --force

RUN npm install
COPY . .

RUN npm run build

# Nginx로 정적 파일 서빙
FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]