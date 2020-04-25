# build the react project
FROM node:13.8.0-alpine as builder
COPY package.json package-lock.json ./
RUN apk update && apk add python g++ make
RUN npm ci && mkdir /app && mv ./node_modules ./app/
WORKDIR /app
COPY . .
RUN npm run build

# set up nginx: remove the default nginx config and static content, replace it with our own
FROM nginx:1.13.3-alpine
RUN rm -rf /etc/nginx/conf.d/*
COPY ums-client.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

# https://medium.com/@avatsaev/create-efficient-angular-docker-images-with-multi-stage-builds-907e2be3008d