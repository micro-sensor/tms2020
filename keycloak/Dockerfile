FROM quay.io/keycloak/keycloak:9.0.2
COPY realm-export.json /tmp/realm-export.json
COPY tmstheme /opt/jboss/keycloak/themes/tmstheme
ENV KEYCLOAK_IMPORT=/tmp/realm-export.json
ENV PROXY_ADDRESS_FORWARDING=true
ENTRYPOINT [ "/opt/jboss/tools/docker-entrypoint.sh" ]
EXPOSE 80
CMD ["-b", "0.0.0.0", "-Dkeycloak.profile.feature.upload_scripts=enabled","-Djboss.http.port=80"]