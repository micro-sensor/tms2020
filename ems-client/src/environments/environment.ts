import { KeycloakConfig } from 'keycloak-angular';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let keycloakConfig: KeycloakConfig = {
  //url: 'http://ec2-3-87-186-137.compute-1.amazonaws.com:8080/auth',
  url: 'https://tcs.ecs.baylor.edu/auth/',
  realm: 'UserManagement',
  clientId: 'ems-frontend'
};

export const environment = {
  production: false,
  keycloak: keycloakConfig,
  umsFrontEndUrl: "https://tcs.ecs.baylor.edu/",
  cmsBackEndUrl: "https://tcs.ecs.baylor.edu/cms"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
