FROM node:12.20.2-alpine3.12 as build
RUN apk update && apk add python3 g++ make
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM nginx:1.17.0-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["nginx","-g","daemon off;"]
