FROM quay.io/keycloak/keycloak:9.0.2
COPY realm-export.json /tmp/realm-export.json
ENV KEYCLOAK_IMPORT=/tmp/realm-export.json
ENV PROXY_ADDRESS_FORWARDING=true
ENTRYPOINT [ "/opt/jboss/tools/docker-entrypoint.sh" ]
CMD ["-b", "0.0.0.0", "-Dkeycloak.profile.feature.upload_scripts=enabled"]