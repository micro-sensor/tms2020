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

- Add custom host entry

```
$ cat /etc/hosts

127.0.0.1 tcs.ecs.baylor.edu
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

## UI Notifications: AlertifyJS

All clients use AlertifyJS, so there is a unified messaging/dialog confirmation across all sites.

To use it requires 4 steps.

First, install alertify by npm:

```
npm install alertifyjs --save
```

Second, use the alertify CDN to include the CSS files in your index.html:

```
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css"/>
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/default.min.css"/>
```

Third, import alertify:

```
import alertify from 'alertifyjs';
```

Finally, use one of the alertify functions:

```
// demonstrates confirmation dialog and notifications:
alertify.confirm('Delete Category', "Do you really want to delete " + dtl.name + "?",
    () => {
        api
            .deleteCategory(this.state.categoryList[this.state.selectedIndex].id)
            .then(c => {
                this.setState(
                    {
                        selectedIndex: -1
                    },
                    () => {
                        this.fetchAll();
                        alertify.success('Success. Category removed.');
                    }
                );
            })
            .catch(e => {
                alertify.error('Error. Could not remove category.');
            });
    },
    function(){} // noop for cancel
);
```