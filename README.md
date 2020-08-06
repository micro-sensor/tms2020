# TMS 2020

## Local deployment

- Copy certificates into `ssl` folder in following structure

```
$ ls -R ssl
certs/ keys/

ssl/certs:
tcs_ecs_baylor_edu.crt

ssl/keys:
tcs_ecs_baylor_edu.key
```

- Specify `extra_hosts` in `docker-compose.yml`. The IP addresses in the `extra_hosts` fields must be matched to the host machine's IP in `ifconfig`.

- Build images

```
$ ./build.sh
```

- (Optional) Login to `cloudhubs2` docker account and push images 

```
$ docker-compose push
```

- (Optional) Cleanup volume (**WARNING**: do this only if necessary, it deletes all data in the database)

```
$ docker-compose down --remove-orphans
$ docker volume rm tms2020_postgres_data
```

- Run images

```
$ docker-compose up --no-build --detach
```

- Access database

    - local: ```$ docker exec -it tms2020_postgres_1 psql -U pguser (local)```
    - production: ```$ sudo docker exec -it tms_postgres_1 psql -U pguser```
    - [how to drop database](doc/Database-Drop.md)

- View logs

```
$ docker ps
$ docker-compose logs -f
$ docker-compose logs -f {container-name}
ex: $ docker-compose logs -f qms
```

- Add custom host entry

```
$ cat /etc/hosts

127.0.0.1 tcs.ecs.baylor.edu
```

- Test email sending on local:
    - Download fakeSMTP and run it on any port you like on your computer.
    - in `ems/src/main/resources/application.properties` set `spring.mail.host` to your computer ip address and `spring.mail.port` to the port you used for fakeSMTP

## Production Redeploy

It was decided to not have code in the server, instead docker images are built and pushed from your local machine, and then images are pulled in production and deployed.

1. **Building images on your local:** Once you test you latest updates, and push your code to bitbucket, you just need to build images on your local `./build.sh`
2. **Push images:** Now you need to push images, `docker-compose push`. Before that you may need to `docker login` with `username: cloudhubs2` and for password you should ask from previous developers or Dr. Cerny.
3. **Pull images in production:** go to `tcs.ecs.baylor.edu` (either from Baylor's network or via `fire.ecs.baylor.edu` tunnel), `cd /tms` and pull images `sudo docker-compose pull`. You may need to `docker login`.
4. **Deploy:** run `sudo docker-compose down` and `sudo docker-compose up --no-build --detach`

## Production deployment from scratch

- Configure `firewalld`, source address should match `subnet` in `docker-compose.yml` file

```
$ sudo docker network inspect {app-internal-network} # note the subnet address
$ sudo firewall-cmd --zone=public --add-masquerade --permanent
$ sudo firewall-cmd --permanent --zone=public --change-interface=docker0
$ sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 source address=172.18.0.0/16 accept'
```

- Copy `docker-compose.yml` file and create empty folders for each services i.e. `cms`, `cms-client`, `nginx`, `postgress`, `keycloak`, etc

- Copy certificates into `ssl` folder in following structure

```
$ ls -R ssl
certs/ keys/

ssl/certs:
tcs_ecs_baylor_edu.crt

ssl/keys:
tcs_ecs_baylor_edu.key
```

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
$ sudo ssh -L 443:127.0.0.1:1234 das@fire.ecs.baylor.edu
$ ssh -L 1234:127.0.0.1:443 das@tcs.ecs.baylor.edu
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

## Other Development notes:

* [UI Notifications](doc/UI_Notifications.md)
* [Rich Text Editor Customization](doc/Rich-Text-Editor.md)
