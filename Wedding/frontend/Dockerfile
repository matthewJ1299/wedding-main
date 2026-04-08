FROM node:22-bookworm-slim AS build

WORKDIR /app

ARG REACT_APP_API_URL=http://localhost:3001
ARG REACT_APP_SITE_URL=http://localhost:8080
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SITE_URL=$REACT_APP_SITE_URL
ENV GENERATE_SOURCEMAP=false

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
