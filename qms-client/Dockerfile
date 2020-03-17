FROM node:12.16.1-alpine as build
RUN apk update && apk add python g++ make
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM nginx:1.17.0-alpine
COPY --from=build /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["nginx","-g","daemon off;"]
