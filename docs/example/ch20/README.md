# Ch20 建立環境

## 安裝 AWS Load Balancer Controller

1. 下載 IAM policy。

    ```bash
    curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.6.0/docs/install/iam_policy.json
    ```

2. 透過 AWS CLI `aws iam create-policy` 命令建立 IAM Policy。

    ```bash
    $ aws iam create-policy \
        --policy-name AWSLoadBalancerControllerIAMPolicy \
        --policy-document file://iam-policy.json
    {
        "Policy": {
            "PolicyName": "AWSLoadBalancerControllerIAMPolicy",
            "PolicyId": "ANPA5V3NJ2SQS4EUBO3FD",
            "Arn": "arn:aws:iam::111111111111:policy/AWSLoadBalancerControllerIAMPolicy",
            "Path": "/",
            "DefaultVersionId": "v1",
            "AttachmentCount": 0,
            "PermissionsBoundaryUsageCount": 0,
            "IsAttachable": true,
            "CreateDate": "2023-08-30T15:57:46+00:00",
            "UpdateDate": "2023-08-30T15:57:46+00:00"
        }
    }
    ```

3. 使用 `eksctl` 命令建立 IRSA（IAM roles for service accounts）的 IAM role 及 Service Account。

    ```bash
    $ eksctl create iamserviceaccount \
        --cluster=ironman \
        --namespace=kube-system \
        --name=aws-load-balancer-controller \
        --attach-policy-arn=arn:aws:iam::111111111111:policy/AWSLoadBalancerControllerIAMPolicy \
        --override-existing-serviceaccounts \
        --region ap-northeast-1 \
        --approve
    2023-08-30 15:59:50 [ℹ]  3 existing iamserviceaccount(s) (amazon-cloudwatch/cloudwatch-agent,amazon-cloudwatch/fluentd,kube-system/aws-node) will be excluded
    2023-08-30 15:59:50 [ℹ]  1 iamserviceaccount (kube-system/aws-load-balancer-controller) was included (based on the include/exclude rules)
    2023-08-30 15:59:50 [!]  metadata of serviceaccounts that exist in Kubernetes will be updated, as --override-existing-serviceaccounts was set
    2023-08-30 15:59:50 [ℹ]  1 task: {
        2 sequential sub-tasks: {
            create IAM role for serviceaccount "kube-system/aws-load-balancer-controller",
            create serviceaccount "kube-system/aws-load-balancer-controller",
        } }2023-08-30 15:59:50 [ℹ]  building iamserviceaccount stack "eksctl-ironman-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
    2023-08-30 15:59:50 [ℹ]  deploying stack "eksctl-ironman-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
    2023-08-30 15:59:50 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
    2023-08-30 16:00:20 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
    2023-08-30 16:00:20 [ℹ]  created serviceaccount "kube-system/aws-load-balancer-controller"
    ```

4. AWS Load Balancer Controller 提供 [Helm](https://helm.sh/) [2] 安裝方式 ，依照 Helm 文件進行安裝，使用最新版本 3.10.0 版本：

    ```bash
    $ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
    $ chmod 700 get_helm.sh
    $ ./get_helm.sh
    [WARNING] Could not find git. It is required for plugin installation.
    Downloading https://get.helm.sh/helm-v3.12.3-linux-amd64.tar.gz
    Verifying checksum... Done.
    Preparing to install helm into /usr/local/bin
    helm installed into /usr/local/bin/helm
    ```

5. 新增 Helm repo：

    ```bash
    $ helm repo add eks https://aws.github.io/eks-charts
    "eks" has been added to your repositories
    ```

6. 於第 3 步驟已經建立 Service Account 過，因此此步驟則無需再次建立 Service Account。

    ```bash
    $ helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=ironman --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller
    NAME: aws-load-balancer-controller
    LAST DEPLOYED: Wed Aug 30 16:03:45 2023
    NAMESPACE: kube-system
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    AWS Load Balancer controller installed!
    ```

    ```bash
    $ kubectl -n kube-system describe deploy aws-load-balancer-controller| grep Image | cut -d "/" -f 3
    aws-load-balancer-controller:v2.6.0
    ```

## 測試環境

1. 以 Nginx server 作為測試，建立 [`nginx-demo-ingress.yaml`](./nginx-demo-ingress.yaml) 包含 `Deployment`、`Service`、`Ingress` 資源。

2. 部署此 YAML。

    ```bash
    $ kubectl apply -f ./nginx-demo-ingress.yaml
    namespace/demo-nginx created
    deployment.apps/demo-nginx-deployment created
    service/service-demo-nginx created
    ingress.networking.k8s.io/ingress-nginx created
    ```

3. 確認 Nginx Pod 皆有正常運作。

    ```bash
    $ kubectl -n demo-nginx get ing,svc,po -o wide
    NAME                                      CLASS   HOSTS   ADDRESS                                                                        PORTS   AGE
    ingress.networking.k8s.io/ingress-nginx   alb     *       k8s-demongin-ingressn-1ac4841e19-1133650141.ap-northeast-1.elb.amazonaws.com   80      42s

    NAME                         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE   SELECTOR
    service/service-demo-nginx   ClusterIP   10.100.100.25   <none>        80/TCP    42s   app=demo-nginx

    NAME                                         READY   STATUS    RESTARTS   AGE   IP               NODE                                                NOMINATED NODE   READINESS GATES
    pod/demo-nginx-deployment-75645cd467-bch2z   1/1     Running   0          42s   192.168.1.129    ip-192-168-18-171.ap-northeast-1.compute.internal   <none>           <none>
    pod/demo-nginx-deployment-75645cd467-d5dxr   1/1     Running   0          42s   192.168.73.219   ip-192-168-70-74.ap-northeast-1.compute.internal    <none>           <none>
    pod/demo-nginx-deployment-75645cd467-j4kvm   1/1     Running   0          42s   192.168.29.67    ip-192-168-18-171.ap-northeast-1.compute.internal   <none>           <none>
    pod/demo-nginx-deployment-75645cd467-n7szj   1/1     Running   0          42s   192.168.9.76     ip-192-168-18-171.ap-northeast-1.compute.internal   <none>           <none>
    pod/demo-nginx-deployment-75645cd467-ncflk   1/1     Running   0          42s   192.168.93.241   ip-192-168-70-74.ap-northeast-1.compute.internal    <none>           <none>
    pod/demo-nginx-deployment-75645cd467-q44vh   1/1     Running   0          42s   192.168.17.54    ip-192-168-18-171.ap-northeast-1.compute.internal   <none>           <none>
    pod/demo-nginx-deployment-75645cd467-q7t5x   1/1     Running   0          42s   192.168.80.15    ip-192-168-70-74.ap-northeast-1.compute.internal    <none>           <none>
    pod/demo-nginx-deployment-75645cd467-qstst   1/1     Running   0          42s   192.168.90.12    ip-192-168-70-74.ap-northeast-1.compute.internal    <none>           <none>
    pod/demo-nginx-deployment-75645cd467-sms55   1/1     Running   0          42s   192.168.26.4     ip-192-168-18-171.ap-northeast-1.compute.internal   <none>           <none>
    pod/demo-nginx-deployment-75645cd467-tgd2w   1/1     Running   0          42s   192.168.65.125   ip-192-168-70-74.ap-northeast-1.compute.internal    <none>           <none>
    ```

4. 查看 Ingress 所建立的 ALB 資源可以正常回應 HTTP 200，由於使用 Nginx latest image 目前最新版本為 1.25.2。

    ```bash
    $ kubectl -n demo-nginx get ing ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[].hostname}'
    k8s-demongin-ingressn-1ac4841e19-1133650141.ap-northeast-1.elb.amazonaws.com

    $ curl -I k8s-demongin-ingressn-1ac4841e19-1133650141.ap-northeast-1.elb.amazonaws.com
    HTTP/1.1 200 OK
    Date: Wed, 30 Aug 2023 16:26:10 GMT
    Content-Type: text/html
    Content-Length: 615
    Connection: keep-alive
    Server: nginx/1.25.2
    Last-Modified: Tue, 15 Aug 2023 17:03:04 GMT
    ETag: "64dbafc8-267"
    Accept-Ranges: bytes
    ```

5. 查看 ELB Target group。

    ```bash
    $ aws elbv2 describe-load-balancers --names k8s-demongin-ingressn-1ac4841e19 --query LoadBalancers[*].LoadBalancerArn --output text
    arn:aws:elasticloadbalancing:ap-northeast-1:111111111111:loadbalancer/app/k8s-demongin-ingressn-1ac4841e19/50233283548abfde

    $ aws elbv2 describe-target-groups --load-balancer-arn arn:aws:elasticloadbalancing:ap-northeast-1:111111111111:loadbalancer/app/k8s-demongin-ingressn-1ac4841e19/50233283548abfde
    {
        "TargetGroups": [
            {
                "TargetGroupArn": "arn:aws:elasticloadbalancing:ap-northeast-1:111111111111:targetgroup/k8s-demongin-serviced-fca572bfee/5515b3210073ed24",
                "TargetGroupName": "k8s-demongin-serviced-fca572bfee",
                "Protocol": "HTTP",
                "Port": 80,
                "VpcId": "vpc-0c135279d2fedea3d",
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
                    "arn:aws:elasticloadbalancing:ap-northeast-1:111111111111:loadbalancer/app/k8s-demongin-ingressn-1ac4841e19/50233283548abfde"
                ],
                "TargetType": "ip",
                "ProtocolVersion": "HTTP1",
                "IpAddressType": "ipv4"
            }
        ]
    }
    ```

    ```bash
    $ aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:ap-northeast-1:111111111111:targetgroup/k8s-demongin-serviced-fca572bfee/5515b3210073ed24 --query 'TargetHealthDescriptions[].[Target, TargetHealth]' --output table
    -----------------------------------------------------------
    |                  DescribeTargetHealth                   |
    +-------------------+------------------+-------+----------+
    | AvailabilityZone  |       Id         | Port  |  State   |
    +-------------------+------------------+-------+----------+
    |  ap-northeast-1a  |  192.168.80.15   |  80   |          |
    |                   |                  |       |  healthy |
    |  ap-northeast-1a  |  192.168.65.125  |  80   |          |
    |                   |                  |       |  healthy |
    |  ap-northeast-1c  |  192.168.29.67   |  80   |          |
    |                   |                  |       |  healthy |
    |  ap-northeast-1c  |  192.168.9.76    |  80   |          |
    |                   |                  |       |  healthy |
    |  ap-northeast-1c  |  192.168.1.129   |  80   |          |
    |                   |                  |       |  healthy |
    |  ap-northeast-1c  |  192.168.17.54   |  80   |          |
    |                   |                  |       |  healthy |
    |  ap-northeast-1a  |  192.168.73.219  |  80   |          |
    |                   |                  |       |  healthy |
    |  ap-northeast-1c  |  192.168.26.4    |  80   |          |
    |                   |                  |       |  healthy |
    |  ap-northeast-1a  |  192.168.90.12   |  80   |          |
    |                   |                  |       |  healthy |
    |  ap-northeast-1a  |  192.168.93.241  |  80   |          |
    |                   |                  |       |  healthy |
    +-------------------+------------------+-------+----------+
    ```

6. 使用以下 `curl` command 每 0.5 秒訪問一次 ALB endpoint。

    ```bash
    $ counter=1; for i in {1..200}; do echo $counter; counter=$((counter+1)); sleep 0.5; curl -I k8s-demongin-ingressn-1ac4841e19-1133650141.ap-northeast-1.elb.amazonaws.com >> test-result.txt; done
    ```

7. 於步驟 6 同一時間，於另一個 terminal 上執行更新 image 至 Nginx image 1.22.0 版本。

    ```bash
    $ kubectl -n demo-nginx set image deploy demo-nginx-deployment demo-nginx=nginx:1.22.0 && kubectl -n demo-nginx rollo
    ut status deploy demo-nginx-deployment
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
    Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
    Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
    Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
    Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
    Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
    Waiting for deployment "demo-nginx-deployment" rollout to finish: 8 out of 10 new replicas have been updated...
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

8. 其結果可以觀察到 ALB HTTP 504 的錯誤訊息。

    ```bash
    $ grep -A2 "50[4|2]" ./test-result.txt
    HTTP/1.1 504 Gateway Time-out
    Server: awselb/2.0
    Date: Wed, 30 Aug 2023 16:41:04 GMT
    --
    HTTP/1.1 504 Gateway Time-out
    Server: awselb/2.0
    Date: Wed, 30 Aug 2023 16:41:14 GMT
    ```

## ALB

1. 更新 namespace label `elbv2.k8s.aws/pod-readiness-gate-inject=enabled` 啟用 Pod Readiness Gates 功能。

```
$ kubectl label namespace demo-nginx elbv2.k8s.aws/pod-readiness-gate-inject=enabled
namespace/demo-nginx labeled
```

2. 更新 `nginx-demo-ingress.yaml` YAML 內容。以下使用 game 2048 作為測試 server。先前在測試驗證過程中，發現 Nginx image 終止（terminated）速度太快，很難識別到底是否真的有遭遇到 HTTP 500-level 的錯誤，故替換成 game 2048 image 進行測試。

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

2. 部署此 YAML。

```
kubectl apply -f  ./nginx-demo-ingress.yaml
```

3. 使用以下 `curl` command 每  0.5 秒訪問一次 ALB endpoint。

```
$ counter=1; for i in {1..200}; do echo $counter; counter=$((counter+1)); sleep │
0.5; curl -I k8s-demongin-ingressn-843da381ab-1111111111.eu-west-1.elb.amazonaws.com >> test-result.txt; done
```

4. 於步驟 3 同一時間，於另一個 terminal 上執行更新 image 至 Nginx image latest 版本。

```
kubectl -n demo-nginx set image deploy demo-nginx-deployment demo-nginx="nginx:latest" && kubectl -n demo-nginx rollout status deploy demo-nginx-deployment
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

1. 刪除所有 namespace demo-nginx 資源。

```
kubectl delete ns demo-nginx --grace-period=0
```

2. 建立 nginx-demo-nlb.yaml 一樣使用與 ALB 相同的 `terminationGracePeriodSeconds` 及 `preStop`。

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

3. 部署此 YAML。

```
$ kubectl apply -f ./nginx-demo-nlb.yaml
namespace/demo-nginx created
deployment.apps/demo-nginx-deployment created
service/service-demo-nginx created

$ kubectl -n demo-nginx get svc -o wide
NAME                         TYPE           CLUSTER-IP      EXTERNAL-IP                                                                     PORT(S)        AGE   SELECTOR
service/service-demo-nginx   LoadBalancer   10.100.58.251   k8s-demongin-serviced-0d3bf709e1-1111111111111111.elb.eu-west-1.amazonaws.com   80:30415/TCP   5m   app=demo-nginx
```

4. 更新 namespace label `elbv2.k8s.aws/pod-readiness-gate-inject=enabled` 啟用 Pod Readiness Gates 功能。

```
$ kubectl label namespace demo-nginx elbv2.k8s.aws/pod-readiness-gate-inject=enabled
namespace/demo-nginx labeled

若 Pod 並未更新 condition 則需要重新啟用 Pod
$ kubectl -n demo-nginx rollout restart deploy demo-nginx-deployment
```

5. 確認 Target Group 使用 IP 類型。

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

6. 使用以下 `curl` command 每 0.5 秒訪問一次 NLB endpoint。因 NLB Target 於 `initial` 進行健康檢查時間較長，因此延長測試時間。

```
counter=1; for i in {1..600}; do echo $counter; counter=$((counter+1)); sleep 0.5; curl -I k8s-demongin-serviced-0d3bf709e1-1111111111111111.elb.eu-west-1.amazonaws.com >> test-nlb-result.txt; done
```

7. 於步驟 6 同一時間，於另一個 terminal 上執行更新 image 至 Nginx image latest 版本。

```
kubectl -n demo-nginx set image deploy demo-nginx-deployment demo-nginx="nginx:" && kubectl -n demo-nginx rollout status deploy demo-nginx-deployment
```

### 結果

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
