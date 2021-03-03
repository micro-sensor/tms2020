import {KeycloakConfig} from 'keycloak-angular';

let keycloakConfig: KeycloakConfig = {
  url: 'http://keycloak/',
  realm: 'UserManagement',
  clientId: 'cms-frontend'
};
export const environment = {
  production: true,
  keycloak: keycloakConfig,
};
