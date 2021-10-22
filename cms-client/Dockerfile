FROM node:13.8.0-alpine as builder
RUN apk update && apk add python g++ make
RUN npm install -g @angular/cli
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG NG_ENV=production
RUN ng build --base-href=/config/

FROM nginx:1.17.0-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/cms-client /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

# https://medium.com/@avatsaev/create-efficient-angular-docker-images-with-multi-stage-builds-907e2be3008d
