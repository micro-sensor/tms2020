# TMS 2020 - Deployment Guide

```
$ docker-compose up --build
```

The IP addresses in the `extra_hosts` fields must be matched to the host machine's IP.

## Development note: React subdirectory

The QMS client is deployed to the subdirectory /questions, which requires these changes:

* nginx.conf: make the `location` for the subdirectory an `alias` for where the content is being served
* package.json and package-lock.json: create the entry `"homepage": "http://tcs.ecs.baylor.edu/questions",`
* TopLevelContainer.js: set the `basename` attribute on the router: `<Router basename={config.routerBase}>`
  * configuration.js: add the required routerBase entry for the above to work: `routerBase: "/questions"`
* index.js: make sure the keycloak.json file is served from the correct address: `const keycloak = Keycloak(process.env.PUBLIC_URL + "/keycloak.json");`
  
