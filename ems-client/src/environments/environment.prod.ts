import {KeycloakConfig} from 'keycloak-angular';

let keycloakConfig: KeycloakConfig = {
  url: 'http://ec2-3-87-186-137.compute-1.amazonaws.com:8080/auth',
  realm: 'UserManagement',
  clientId: 'ems-frontend'
};
export const environment = {
  production: true,
  keycloak: keycloakConfig,
};
