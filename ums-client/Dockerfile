FROM node:13.8.0-alpine as builder
COPY package.json package-lock.json ./
RUN apk update && apk add python g++ make
RUN npm ci && mkdir /app && mv ./node_modules ./app/
WORKDIR /app
COPY . .
RUN npm run build


FROM nginx:1.13.3-alpine
#COPY nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

# https://medium.com/@avatsaev/create-efficient-angular-docker-images-with-multi-stage-builds-907e2be3008d