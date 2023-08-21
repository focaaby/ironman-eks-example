# 建立環境

## 安裝 AWS Load Balancer Controller

1.  下載 IAM policy。
```
$ curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.4/docs/install/iam_policy.json
```
2.  透過 AWS CLI `aws iam create-policy` 命令建立 IAM Policy。
```
$ aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam-policy.json
```
3.  使用 `eksctl` 命令建立 IRSA（IAM roles for service accounts）的 IAM role 及 Service Account
```
$ eksctl create iamserviceaccount \
    --cluster=ironman-2022 \
    --namespace=kube-system \
    --name=aws-load-balancer-controller \
    --attach-policy-arn=arn:aws:iam::111111111111:policy/AWSLoadBalancerControllerIAMPolicy \
    --override-existing-serviceaccounts \
    --region eu-west-1 \
    --approve
2022-10-11 14:07:43 [ℹ]  4 existing iamserviceaccount(s) (amazon-cloudwatch/cloudwatch-agent,amazon-cloudwatch/fluentd,default/my-s3-sa,kube-system/aws-node) will be excluded
2022-10-11 14:07:43 [ℹ]  1 iamserviceaccount (kube-system/aws-load-balancer-controller) was included (based on the include/exclude rules)
2022-10-11 14:07:43 [!]  metadata of serviceaccounts that exist in Kubernetes will be updated, as --override-existing-serviceaccounts was set
2022-10-11 14:07:43 [ℹ]  1 task: {
    2 sequential sub-tasks: {
        create IAM role for serviceaccount "kube-system/aws-load-balancer-controller",
        create serviceaccount "kube-system/aws-load-balancer-controller",
    } }2022-10-11 14:07:43 [ℹ]  building iamserviceaccount stack "eksctl-ironman-2022-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
2022-10-11 14:07:44 [ℹ]  deploying stack "eksctl-ironman-2022-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
2022-10-11 14:07:44 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-2022-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
2022-10-11 14:08:14 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-2022-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
2022-10-11 14:08:14 [ℹ]  created serviceaccount "kube-system/aws-load-balancer-controller"
```
4.  AWS Load Balancer Controller 提供 [Helm](https://helm.sh/) [2] ，依照 Helm 文件進行安裝，使用最新版本 3.10.0 版本：

```
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh
Downloading https://get.helm.sh/helm-v3.10.0-linux-amd64.tar.gz
Verifying checksum... Done.
Preparing to install helm into /usr/local/bin
helm installed into /usr/local/bin/helm
```
5.  新增 Helm repo：
```
$ helm repo add eks https://aws.github.io/eks-charts
```
6.  於第 3 步驟已經建立 Service Account 過，因此此步驟則無需再次建立 Service Account。
```
$ helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=ironman-2022 --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller
NAME: aws-load-balancer-controller
LAST DEPLOYED: Tue Oct 11 14:11:56 2022
NAMESPACE: kube-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
AWS Load Balancer controller installed!
```

## 測試環境

1.  以 Nginx server 作為測試，建立 nginx-demo-ingress.yaml 包含 Deployment、Service、Ingress 資源。

```
$ cat ./nginx-demo-ingress.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: "demo-nginx"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "demo-nginx-deployment"
  namespace: "demo-nginx"
spec:
  selector:
    matchLabels:
      app: "demo-nginx"
  replicas: 10
  template:
    metadata:
      labels:
        app: "demo-nginx"
        role: "backend"
    spec:
      containers:
      - image: nginx:latest
        imagePullPolicy: Always
        name: "demo-nginx"
        ports:
        - containerPort: 80
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
---
apiVersion: v1
kind: Service
metadata:
  name: "service-demo-nginx"
  namespace: "demo-nginx"
spec:
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP
  selector:
    app: "demo-nginx"
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  namespace: "demo-nginx"
  name: "ingress-nginx"
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  rules:
  - http:
      paths:
      - path: "/"
        pathType: Prefix
        backend:
          service:
            name: service-demo-nginx
            port:
              number: 80
```
2.  部署此 YAML。
```
$ kubectl apply -f  ./nginx-demo-ingress.yaml
namespace/demo-nginx created
deployment.apps/demo-nginx-deployment created
service/service-demo-nginx created
ingress.networking.k8s.io/ingress-nginx created
```
3.  確認 Nginx Pod 皆有正常運作。
```
$ kubectl -n demo-nginx get ing,svc,po -o wide
NAME                                      CLASS    HOSTS   ADDRESS                                                                   PORTS   AGE
ingress.networking.k8s.io/ingress-nginx   <none>   *       k8s-demongin-ingressn-843da381ab-1111111111.eu-west-1.elb.amazonaws.com   80      56m

NAME                         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE   SELECTOR
service/service-demo-nginx   ClusterIP   10.100.247.243   <none>        80/TCP    56m   app=demo-nginx

NAME                                         READY   STATUS    RESTARTS   AGE   IP               NODE                                           NOMINATED NODE   READINESS GATES
pod/demo-nginx-deployment-75966cf8c6-2ntf4   1/1     Running   0          10m   192.168.56.52    ip-192-168-61-79.eu-west-1.compute.internal    <none>           <none>
pod/demo-nginx-deployment-75966cf8c6-4nzz7   1/1     Running   0          10m   192.168.91.189   ip-192-168-76-241.eu-west-1.compute.internal   <none>           <none>
pod/demo-nginx-deployment-75966cf8c6-4qgtj   1/1     Running   0          10m   192.168.74.144   ip-192-168-71-85.eu-west-1.compute.internal    <none>           <none>
pod/demo-nginx-deployment-75966cf8c6-5b6ws   1/1     Running   0          10m   192.168.25.57    ip-192-168-18-190.eu-west-1.compute.internal   <none>           <none>
pod/demo-nginx-deployment-75966cf8c6-6khx4   1/1     Running   0          10m   192.168.69.15    ip-192-168-71-85.eu-west-1.compute.internal    <none>           <none>
pod/demo-nginx-deployment-75966cf8c6-c76pr   1/1     Running   0          10m   192.168.40.177   ip-192-168-61-79.eu-west-1.compute.internal    <none>           <none>
pod/demo-nginx-deployment-75966cf8c6-dsztw   1/1     Running   0          10m   192.168.67.240   ip-192-168-76-241.eu-west-1.compute.internal   <none>           <none>
pod/demo-nginx-deployment-75966cf8c6-qlkj2   1/1     Running   0          10m   192.168.62.119   ip-192-168-55-245.eu-west-1.compute.internal   <none>           <none>
pod/demo-nginx-deployment-75966cf8c6-stt9c   1/1     Running   0          10m   192.168.29.171   ip-192-168-18-190.eu-west-1.compute.internal   <none>           <none>
pod/demo-nginx-deployment-75966cf8c6-zfzzf   1/1     Running   0          10m   192.168.49.142   ip-192-168-55-245.eu-west-1.compute.internal   <none>           <none>
```
5.  查看 Ingress 所建立的 ALB 資源可以正常響應 HTTP 200，由於使用 Nginx latest image 目前最新版本為 1.23.1
```
$ curl -I k8s-demongin-ingressn-843da381ab-1111111111.eu-west-1.elb.amazonaws.com
HTTP/1.1 200 OK
Date: Tue, 11 Oct 2022 15:38:44 GMT
Content-Type: text/html
Content-Length: 615
Connection: keep-alive
Server: nginx/1.23.1
Last-Modified: Mon, 23 May 2022 22:59:19 GMT
ETag: "628c1fd7-267"
Accept-Ranges: bytes
```
6.  查看 ELB Target group。
```
$ aws elbv2 describe-target-groups --load-balancer-arn arn:aws:elasticloadbalancing:eu-west-1:111111111111:loadbalancer/app/k8s-demongin-ingressn-843da381ab/9a5746ba008507c3
{
    "TargetGroups": [
        {
            "TargetGroupArn": "arn:aws:elasticloadbalancing:eu-west-1:111111111111:targetgroup/k8s-demongin-serviced-610dd2305f/ffd6c2b5292a36c2",
            "TargetGroupName": "k8s-demongin-serviced-610dd2305f",
            "Protocol": "HTTP",
            "Port": 80,
            "VpcId": "vpc-0b150640c72b722db",
            "HealthCheckProtocol": "HTTP",
            "HealthCheckPort": "traffic-port",
            "HealthCheckEnabled": true,
            "HealthCheckIntervalSeconds": 15,
            "HealthCheckTimeoutSeconds": 5,
            "HealthyThresholdCount": 2,
            "UnhealthyThresholdCount": 2,
            "HealthCheckPath": "/",
            "Matcher": {
                "HttpCode": "200"
            },
            "LoadBalancerArns": [
                "arn:aws:elasticloadbalancing:eu-west-1:111111111111:loadbalancer/app/k8s-demongin-ingressn-843da381ab/9a5746ba008507c3"
            ],
            "TargetType": "ip",
            "ProtocolVersion": "HTTP1",
            "IpAddressType": "ipv4"
        }
    ]
}
```

```
$ aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:eu-west-1:111111111111:targetgroup/k8s-demongin-serviced-610dd2305f/ffd6c2b5292a36c2 --query 'TargetHealthDescriptions[].[Target, TargetHealth]' --output table
-----------------------------------------------------------
|                  DescribeTargetHealth                   |
+-------------------+------------------+-------+----------+
| AvailabilityZone  |       Id         | Port  |  State   |
+-------------------+------------------+-------+----------+
|  eu-west-1c       |  192.168.40.177  |  80   |          |
|                   |                  |       |  healthy |
|  eu-west-1c       |  192.168.62.119  |  80   |          |
|                   |                  |       |  healthy |
|  eu-west-1a       |  192.168.25.57   |  80   |          |
|                   |                  |       |  healthy |
|  eu-west-1b       |  192.168.74.144  |  80   |          |
|                   |                  |       |  healthy |
|  eu-west-1b       |  192.168.69.15   |  80   |          |
|                   |                  |       |  healthy |
|  eu-west-1c       |  192.168.56.52   |  80   |          |
|                   |                  |       |  healthy |
|  eu-west-1a       |  192.168.29.171  |  80   |          |
|                   |                  |       |  healthy |
|  eu-west-1b       |  192.168.91.189  |  80   |          |
|                   |                  |       |  healthy |
|  eu-west-1c       |  192.168.49.142  |  80   |          |
|                   |                  |       |  healthy |
|  eu-west-1b       |  192.168.67.240  |  80   |          |
|                   |                  |       |  healthy |
+-------------------+------------------+-------+----------+

```

6.  使用以下 `curl` command 每  0.5 秒訪問一次 ALB endpoint。
```
$ counter=1; for i in {1..200}; do echo $counter; counter=$((counter+1)); sleep │
0.5; curl -I k8s-demongin-ingressn-843da381ab-1111111111.eu-west-1.elb.amazonaws.com >> test-result.txt; done
```
7.  於步驟 6 同一時間，於另一個 terminal 上執行更新 image 至 Nginx image 1.22.0 版本。
```
$ kubectl -n demo-nginx set image deploy demo-nginx-deployment demo-nginx=nginx:1.22.0 && kubectl -n demo-nginx rollout status deploy demo-nginx-deployment
deployment.apps/demo-nginx-deployment image updated
Waiting for deployment "demo-nginx-deployment" rollout to finish: 5 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 5 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 5 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 5 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 5 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 6 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 6 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 6 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 6 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 7 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 7 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 7 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 7 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 9 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 9 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 9 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 9 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 9 out of 10 new replicas have been updated...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 3 old replicas are pending termination...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 3 old replicas are pending termination...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 3 old replicas are pending termination...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 2 old replicas are pending termination...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 2 old replicas are pending termination...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 2 old replicas are pending termination...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 of 10 updated replicas are available...
Waiting for deployment "demo-nginx-deployment" rollout to finish: 9 of 10 updated replicas are available...
deployment "demo-nginx-deployment" successfully rolled out
```
8.  其結果可以觀察到 ALB HTTP 502 的錯誤訊息。

```
$ grep -A2 "502" ./test-result.txt
HTTP/1.1 502 Bad Gateway
Server: awselb/2.0
Date: Tue, 11 Oct 2022 15:39:56 GMT
--
HTTP/1.1 502 Bad Gateway
Server: awselb/2.0
Date: Tue, 11 Oct 2022 15:39:59 GMT
--
HTTP/1.1 502 Bad Gateway
Server: awselb/2.0
Date: Tue, 11 Oct 2022 15:40:03 GMT
--
HTTP/1.1 502 Bad Gateway
Server: awselb/2.0
Date: Tue, 11 Oct 2022 15:39:06 GMT
```

以下環境使用 AWS Load Balancer Controller  v2.4.3 進行測試：
```
$ kubectl -n kube-system get deploy aws-load-balancer-controller -o yaml | grep "image: "
        image: 602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller:v2.4.3
```

## ALB
1.  更新 namespace label `elbv2.k8s.aws/pod-readiness-gate-inject=enabled` 啟用 Pod Readiness Gates 功能。
```
$ kubectl label namespace demo-nginx elbv2.k8s.aws/pod-readiness-gate-inject=enabled
namespace/demo-nginx labeled
```
2.  更新 `nginx-demo-ingress.yaml` YAML 內容。以下使用 game 2048 作為測試 server。先前在測試驗證過程中，發現 Nginx image 終止（terminated）速度太快，很難識別到底是否真的有遭遇到 HTTP 500-level 的錯誤，故替換成 game 2048 image 進行測試。

其 game 2048 需要約 40 秒時間才能完全終止，故 sleep 約 40 秒時間， `terminationGracePeriodSeconds` 則額外延長 20 秒故設定 60 秒，
```
$ cat ./nginx-demo-ingress.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: "demo-nginx"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "demo-nginx-deployment"
  namespace: "demo-nginx"
spec:
  selector:
    matchLabels:
      app: "demo-nginx"
  replicas: 10
  template:
    metadata:
      labels:
        app: "demo-nginx"
        role: "backend"
    spec:
      terminationGracePeriodSeconds: 60
      containers:
        # - image: nginx:latest
      - image: public.ecr.aws/l6m2t8p7/docker-2048:latest
        imagePullPolicy: Always
        name: "demo-nginx"
        ports:
        - containerPort: 80
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 40"]

  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
---
apiVersion: v1
kind: Service
metadata:
  name: "service-demo-nginx"
  namespace: "demo-nginx"
spec:
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP
  selector:
    app: "demo-nginx"
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  namespace: "demo-nginx"
  name: "ingress-nginx"
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  rules:
  - http:
      paths:
      - path: "/"
        pathType: Prefix
        backend:
          service:
            name: service-demo-nginx
            port:
```
2.  部署此 YAML。
```
$ kubectl apply -f  ./nginx-demo-ingress.yaml
```
3.  使用以下 `curl` command 每  0.5 秒訪問一次 ALB endpoint。
```
$ counter=1; for i in {1..200}; do echo $counter; counter=$((counter+1)); sleep │
0.5; curl -I k8s-demongin-ingressn-843da381ab-1111111111.eu-west-1.elb.amazonaws.com >> test-result.txt; done
```
4.  於步驟 3 同一時間，於另一個 terminal 上執行更新 image 至 Nginx image latest 版本。
```
$ kubectl -n demo-nginx set image deploy demo-nginx-deployment demo-nginx="nginx:latest" && kubectl -n demo-nginx rollout status deploy demo-nginx-deployment
```

### 結果
未查看到 HTTP 500-level，其中在 Server 欄位上也可以觀察到由 nginx 逐漸替換成 `nginx/1.23.1`。
```
$ grep "50[2|3|4]" ./test-result.txt

$ grep "Server: " ./test-result.txt
...
Server: nginx
Server: nginx
Server: nginx
Server: nginx
Server: nginx/1.23.1
Server: nginx/1.23.1
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx/1.23.1
Server: nginx/1.23.1
Server: nginx
Server: nginx/1.23.1
Server: nginx/1.23.1
Server: nginx/1.23.1
Server: nginx/1.23.1
Server: nginx/1.23.1
Server: nginx/1.23.1
Server: nginx/1.23.1
...
...
```

## NLB
1.  刪除所有 namespace demo-nginx 資源。
```
$ kubectl delete ns demo-nginx --grace-period=0
```
2.  建立 nginx-demo-nlb.yaml 一樣使用與 ALB 相同的 `terminationGracePeriodSeconds` 及 `preStop`。
```
$ cat ./nginx-demo-nlb.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: "demo-nginx"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "demo-nginx-deployment"
  namespace: "demo-nginx"
spec:
  selector:
    matchLabels:
      app: "demo-nginx"
  replicas: 10
  template:
    metadata:
      labels:
        app: "demo-nginx"
        role: "backend"
    spec:
      terminationGracePeriodSeconds: 60
      containers:
        # - image: nginx:latest
      - image: public.ecr.aws/l6m2t8p7/docker-2048:latest
        imagePullPolicy: Always
        name: "demo-nginx"
        ports:
        - containerPort: 80
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 40"]

  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
---
apiVersion: v1
kind: Service
metadata:
  name: "service-demo-nginx"
  namespace: "demo-nginx"
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip
spec:
  loadBalancerClass: service.k8s.aws/nlb
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP
  selector:
    app: "demo-nginx"
```
3.  部署此 YAML。
```
$ kubectl apply -f ./nginx-demo-nlb.yaml
namespace/demo-nginx created
deployment.apps/demo-nginx-deployment created
service/service-demo-nginx created

$ kubectl -n demo-nginx get svc -o wide
NAME                         TYPE           CLUSTER-IP      EXTERNAL-IP                                                                     PORT(S)        AGE   SELECTOR
service/service-demo-nginx   LoadBalancer   10.100.58.251   k8s-demongin-serviced-0d3bf709e1-1111111111111111.elb.eu-west-1.amazonaws.com   80:30415/TCP   5m   app=demo-nginx
```
4.  更新 namespace label `elbv2.k8s.aws/pod-readiness-gate-inject=enabled` 啟用 Pod Readiness Gates 功能。
```
$ kubectl label namespace demo-nginx elbv2.k8s.aws/pod-readiness-gate-inject=enabled
namespace/demo-nginx labeled

若 Pod 並未更新 condition 則需要重新啟用 Pod 
$ kubectl -n demo-nginx rollout restart deploy demo-nginx-deployment
```
5.  確認 Target Group 使用 IP 類型。
```
$ aws elbv2 describe-target-groups --load-balancer-arn arn:aws:elasticloadbalancing:eu-west-1:111111111111:loadbalancer/net/k8s-demongin-serviced-0d3bf709e1/1111111111111111

{
    "TargetGroups": [
        {
            "TargetGroupArn": "arn:aws:elasticloadbalancing:eu-west-1:111111111111:targetgroup/k8s-demongin-serviced-4a99c83f08/c9a702f211fbfc53",
            "TargetGroupName": "k8s-demongin-serviced-4a99c83f08",
            "Protocol": "TCP",
            "Port": 80,
            "VpcId": "vpc-0b150640c72b722db",
            "HealthCheckProtocol": "TCP",
            "HealthCheckPort": "traffic-port",
            "HealthCheckEnabled": true,
            "HealthCheckIntervalSeconds": 10,
            "HealthCheckTimeoutSeconds": 10,
            "HealthyThresholdCount": 3,
            "UnhealthyThresholdCount": 3,
            "LoadBalancerArns": [
                "arn:aws:elasticloadbalancing:eu-west-1:111111111111:loadbalancer/net/k8s-demongin-serviced-0d3bf709e1/1111111111111111"
            ],
            "TargetType": "ip",
            "IpAddressType": "ipv4"
        }
    ]
}
```
也可以查看 Target id 為 IP 地址。
```
$ aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:eu-west-1:111111111111:targetgroup/k8s-demongin-serviced-4a99c83f08/c9a702f211fbfc53 --query 'TargetHealthDescriptions[].Target' --output table
------------------------------------------------
|             DescribeTargetHealth             |
+-------------------+------------------+-------+
| AvailabilityZone  |       Id         | Port  |
+-------------------+------------------+-------+
|  eu-west-1a       |  192.168.0.223   |  80   |
|  eu-west-1c       |  192.168.44.248  |  80   |
|  eu-west-1a       |  192.168.19.10   |  80   |
|  eu-west-1c       |  192.168.41.36   |  80   |
|  eu-west-1b       |  192.168.76.79   |  80   |
|  eu-west-1b       |  192.168.83.233  |  80   |
|  eu-west-1a       |  192.168.22.141  |  80   |
|  eu-west-1b       |  192.168.80.209  |  80   |
|  eu-west-1b       |  192.168.66.152  |  80   |
|  eu-west-1b       |  192.168.66.129  |  80   |
|  eu-west-1c       |  192.168.55.7    |  80   |
|  eu-west-1c       |  192.168.61.246  |  80   |
|  eu-west-1c       |  192.168.49.142  |  80   |
|  eu-west-1c       |  192.168.45.23   |  80   |
|  eu-west-1b       |  192.168.67.240  |  80   |
+-------------------+------------------+-------+

```
6.  使用以下 `curl` command 每 0.5 秒訪問一次 NLB endpoint。因 NLB Target 於 `initial` 進行健康檢查時間較長，因此延長測試時間。
```
$ counter=1; for i in {1..600}; do echo $counter; counter=$((counter+1)); sleep 0.5; curl -I k8s-demongin-serviced-0d3bf709e1-1111111111111111.elb.eu-west-1.amazonaws.com >> test-nlb-result.txt; done
```
7.  於步驟 6 同一時間，於另一個 terminal 上執行更新 image 至 Nginx image latest 版本。
```
$ kubectl -n demo-nginx set image deploy demo-nginx-deployment demo-nginx="nginx:" && kubectl -n demo-nginx rollout status deploy demo-nginx-deployment
```

## 結果
在 Pod 更新過程中，透過 AWS CLI `aws elbv2 describe-target-health`  檢查 Target Group 健康檢查狀態，可以觀察確認 Target `initial` 及 `draining`。
```
$ aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:eu-west-1:111111111111:targetgroup/k8s-demongin-serviced-4a99c83f08/c9a702f211fbfc53 --query 'TargetHealthDescriptions[].[Target.Id,TargetHealth.State]' --output table
--------------------------------
|     DescribeTargetHealth     |
+-----------------+------------+
|  192.168.48.65  |  draining  |
|  192.168.0.136  |  initial   |
|  192.168.25.57  |  healthy   |
|  192.168.84.107 |  healthy   |
|  192.168.22.132 |  draining  |
|  192.168.69.15  |  healthy   |
|  192.168.56.52  |  draining  |
|  192.168.19.10  |  draining  |
|  192.168.41.36  |  initial   |
|  192.168.80.209 |  initial   |
|  192.168.66.152 |  healthy   |
|  192.168.48.198 |  healthy   |
|  192.168.56.132 |  healthy   |
|  192.168.66.129 |  healthy   |
|  192.168.55.7   |  initial   |
|  192.168.49.142 |  draining  |
|  192.168.67.240 |  initial   |
|  192.168.45.23  |  healthy   |
+-----------------+------------+
```

檢視結果輸出 `test-nlb-result.txt` 未查看到 HTTP 500-level，其中在 Server 欄位上也可以觀察到由 nginx 逐漸替換成 `nginx/1.23.1`。

```
$ grep "50[2|3|4]" ./test-nlb-result.txt

$ grep "Server: " ./test-nlb-result.txt
...
...
...
Server: nginx
Server: nginx/1.23.1
Server: nginx/1.23.1
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx
Server: nginx
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx
Server: nginx
Server: nginx
Server: nginx
Server: nginx
Server: nginx
Server: nginx
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx
Server: nginx/1.23.1
Server: nginx/1.23.1
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx/1.23.1
Server: nginx
Server: nginx
Server: nginx/1.23.1
Server: nginx
...
...
...
```

