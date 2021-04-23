
## Using Istio

### Install Istio

```bash
$ curl -L https://istio.io/downloadIstio | sh -

$ cd istio-1.9.4

$ export PATH=$PWD/bin:$PATH

$ istioctl install --set profile=demo --set meshConfig.accessLogEncoding=JSON
$ kubectl create ns test
$ kubectl label namespace test istio-injection=enabled
```

### update ingress gateway

```bash
$ k edit deploy -n istio-system istio-ingressgateway
----
    image: docker.io/istio/proxyv2:1.9.3
    imagePullPolicy: IfNotPresent
    name: istio-proxy
    ports:
    - containerPort: 8080
      hostPort: 80
      protocol: TCP
    - containerPort: 8443
      hostPort: 443
      protocol: TCP
```


### Build Image

```bash
$ eval $(minikube docker-env)
$ cd tms2020
$ ./build.sh
```

# deploy tms2020

```bash
$ cd kubernetes-manifest
# update host_alias with minikube ip
$ k apply -f .
```

