FROM nginx:1.17.0-alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["nginx","-g","daemon off;"]
