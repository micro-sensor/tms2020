# TMS 2020

## Local deployment

- Copy certificates into `ssl` folder in following structure. Contact authors for the SSL files.

```
$ ls -R ssl
certs/ keys/

ssl/certs:
tcs_ecs_baylor_edu.crt

ssl/keys:
tcs_ecs_baylor_edu.key
```

- (Optional, if default does not work) Specify `extra_hosts` in `docker-compose.yml`. The IP addresses in the `extra_hosts` fields must be matched to the host machine's IP in `ifconfig`.

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

- Add users:
    - Visit Keycloak admin page `https://tcs.ecs.baylor.edu/auth`. 
    - Login with deafult username/password: `admin`/`password`. 
    - Add new user, credential, and roles.
    
- Visit homepage `https://tcs.ecs.baylor.edu` and login with the created username and password.

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

## Deploy in kubernetes (minikube)

Build images inside minikube,

```bash
$ eval $(minikube docker-env)
$ ./build.sh
```

Edit core-dns config file,
```bash
$ kubectl edit configmap coredns -n kube-system
 11 apiVersion: v1
 10 data:
  9   Corefile: |
  8     .:53 {
  7         errors
  6         health {
  5            lameduck 5s
  4         }
  3         ready
  2         rewrite stop {
                name regex (.*)\.my\.domain\.$ {1}.default.svc.cluster.local
                answer name (.*)\.default\.svc\.cluster\.local\.$ {1}.my.domain
             }  
    rewrite stop {
      name regex (.*)\.baylor.edu\.$ {1}.default.svc.cluster.local
      answer name (.*)\.default\.svc\.cluster\.local\.$ {1}.baylor.edu
    }  
  1         kubernetes cluster.local in-addr.arpa ip6.arpa {
16             pods insecure
  1            fallthrough in-addr.arpa ip6.arpa
  2            ttl 30
  3         }
  4         prometheus :9153
  5         forward . /etc/resolv.conf {
  6            max_concurrent 1000
  7         }
  8         cache 30
  9         loop
 10         reload
 11         loadbalance
 12     }
```

Trigger core-dns pod restart,
```bash
$ kubectl -n kube-system delete pod <coredns_pod_1> <coredns_pod_2>
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
