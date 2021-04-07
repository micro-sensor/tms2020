
## Using Istio

### Install Istio

```bash
$ curl -L https://istio.io/downloadIstio | sh -
or, curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.6.8 TARGET_ARCH=x86_64 sh -

$ cd istio-1.9.2

$ export PATH=$PWD/bin:$PATH

$ istioctl install --set profile=demo -y

$ kubectl label namespace default istio-injection=enabled
```

### enable kube-ingress dns

### Deploy TMS

```bash
$ kubectl create ns test
$ kubectl label namespace test istio-injection=enabled
```

Get, istio ingress-

