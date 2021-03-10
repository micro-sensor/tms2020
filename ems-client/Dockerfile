FROM node:12.16.2-alpine3.10 as builder
RUN apk update && apk add python g++ make
RUN npm install -g @angular/cli
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# ARG NG_ENV=production
RUN ng build --base-href=/exams/

FROM nginx:1.17.0-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/base-app /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

# https://medium.com/@avatsaev/create-efficient-angular-docker-images-with-multi-stage-builds-907e2be3008d
