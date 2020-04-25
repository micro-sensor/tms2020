# TMS 2020 - Deployment Guide

## Deploy

- Build and push images

```
$ ./build.sh
```

- Add `TMS_KEYCLOAK_PASSWORD` in `.env` file (production only)

- Specify `subnet` (production only) and `extra_hosts` in `docker-compose.yml`. The IP addresses in the `extra_hosts` fields must be matched to the host machine's IP

- Run

```
$ docker-compose up --no-build --detach
```

- Cleanup DB data

```
$ docker-compose down --remove-orphans
$ docker volume rm tms2020_postgres_data || true
```

## Port forwarding

```
$ sudo ssh -L 80:127.0.0.1:1234 das@fire.ecs.baylor.edu
$ ssh -L 1234:127.0.0.1:80 das@tcs.ecs.baylor.edu
```

```
$ cat /etc/hosts

127.0.0.1 tcs.ecs.baylor.edu
```

## Configure `firewalld`

```
$ sudo docker network inspect {app-internal-network} # note the subnet address
$ sudo firewall-cmd --zone=public --add-masquerade --permanent
$ sudo firewall-cmd --permanent --zone=public --change-interface=docker0
$ sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 source address=172.18.0.0/16 accept'
```

## Development note: React subdirectory

The QMS client is deployed to the subdirectory /questions, which requires these changes:

* nginx.conf: make the `location` for the subdirectory an `alias` for where the content is being served
* package.json and package-lock.json: create the entry `"homepage": "http://tcs.ecs.baylor.edu/questions",`
* TopLevelContainer.js: set the `basename` attribute on the router: `<Router basename={config.routerBase}>`
  * configuration.js: add the required routerBase entry for the above to work: `routerBase: "/questions"`
* index.js: make sure the keycloak.json file is served from the correct address: `const keycloak = Keycloak(process.env.PUBLIC_URL + "/keycloak.json");`
