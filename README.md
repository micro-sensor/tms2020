# TMS 2020

## Local deployment

- Specify `extra_hosts` in `docker-compose.yml`. The IP addresses in the `extra_hosts` fields must be matched to the host machine's IP in `ifconfig`.

- Build images

```
$ ./build.sh
```

- (Optional) Login to `cloudhubs2` docker account and push images 

```
$ docker-compose push
```

- (Optional) Cleanup volume (**WARNING**: do this only if necessary)

```
$ docker-compose down --remove-orphans
$ docker volume rm tms2020_postgres_data
```

- Run images

```
$ docker-compose up --no-build --detach
```

- View logs

```
$ docker ps
$ docker-compose logs -f
```

## Production deployment

- Configure `firewalld`, source address should match `subnet` in `docker-compose.yml` file

```
$ sudo docker network inspect {app-internal-network} # note the subnet address
$ sudo firewall-cmd --zone=public --add-masquerade --permanent
$ sudo firewall-cmd --permanent --zone=public --change-interface=docker0
$ sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 source address=172.18.0.0/16 accept'
```

- Copy `docker-compose.yml` file and create empty folders for each services i.e. `cms`, `cms-client`, `nginx`, `postgress`, `keycloak`, etc

- Specify `subnet` and `extra_hosts` in `docker-compose.yml` file. For example, if subnet is `172.18.0.0/16` then use `172.18.0.1` in `extra_hosts`

- Create `.env` file and add `TMS_KEYCLOAK_PASSWORD=<keycloak-admin-password>`

- Pull images

```
docker-compose pull
```

- (Optional) Cleanup volume (**WARNING**: do this only if necessary)

```
$ docker-compose down --remove-orphans
$ docker volume rm tms_postgres_data
```

- Run images

```
$ docker-compose up --no-build --detach
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

## Development note: React subdirectory

The QMS client is deployed to the subdirectory /questions, which requires these changes:

* nginx.conf: make the `location` for the subdirectory an `alias` for where the content is being served
* package.json and package-lock.json: create the entry `"homepage": "http://tcs.ecs.baylor.edu/questions",`
* TopLevelContainer.js: set the `basename` attribute on the router: `<Router basename={config.routerBase}>`
  * configuration.js: add the required routerBase entry for the above to work: `routerBase: "/questions"`
* index.js: make sure the keycloak.json file is served from the correct address: `const keycloak = Keycloak(process.env.PUBLIC_URL + "/keycloak.json");`
