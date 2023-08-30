# 建立測試 EKS 1.26 叢集

## 步驟

1. 建立 [demo-upgrade.yaml](./demo-upgrade.yaml) YAML 檔案啟用控制平面記錄檔案，並透過 `eksctl` 命令建立叢集。
```
$ cat ./demo-upgrade.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: demo-upgrade
  version: "1.26"
  region: ap-northeast-1

managedNodeGroups:
  - name: "ng"
    desiredCapacity: 1

cloudWatch:
  clusterLogging:
    enableTypes: ["*"]

$ $ eksctl create cluster -f ./demo-upgrade.yaml
2023-08-26 16:13:28 [ℹ]  eksctl version 0.151.0
2023-08-26 16:13:28 [ℹ]  using region ap-northeast-1
2023-08-26 16:13:28 [ℹ]  setting availability zones to [ap-northeast-1d ap-northeast-1c ap-northeast-1a]
2023-08-26 16:13:28 [ℹ]  subnets for ap-northeast-1d - public:192.168.0.0/19 private:192.168.96.0/19
2023-08-26 16:13:28 [ℹ]  subnets for ap-northeast-1c - public:192.168.32.0/19 private:192.168.128.0/19
2023-08-26 16:13:28 [ℹ]  subnets for ap-northeast-1a - public:192.168.64.0/19 private:192.168.160.0/19
2023-08-26 16:13:28 [ℹ]  nodegroup "ng" will use "" [AmazonLinux2/1.26]
2023-08-26 16:13:28 [ℹ]  using Kubernetes version 1.26
2023-08-26 16:13:28 [ℹ]  creating EKS cluster "demo-upgrade" in "ap-northeast-1" region with managed nodes
2023-08-26 16:13:28 [ℹ]  1 nodegroup (ng) was included (based on the include/exclude rules)
2023-08-26 16:13:28 [ℹ]  will create a CloudFormation stack for cluster itself and 0 nodegroup stack(s)
2023-08-26 16:13:28 [ℹ]  will create a CloudFormation stack for cluster itself and 1 managed nodegroup stack(s)
2023-08-26 16:13:28 [ℹ]  if you encounter any issues, check CloudFormation console or try 'eksctl utils describe-stacks --region=ap-northeast-1 --cluster=demo-upgrade'
2023-08-26 16:13:28 [ℹ]  Kubernetes API endpoint access will use default of {publicAccess=true, privateAccess=false} for cluster "demo-upgrade" in "ap-northeast-1"
2023-08-26 16:13:28 [ℹ]  configuring CloudWatch logging for cluster "demo-upgrade" in "ap-northeast-1" (enabled types: api, audit, authenticator, controllerManager, scheduler & no types disabled)
2023-08-26 16:13:28 [ℹ]
2 sequential tasks: { create cluster control plane "demo-upgrade",
    2 sequential sub-tasks: {
        wait for control plane to become ready,
        create managed nodegroup "ng",
    }
}
2023-08-26 16:13:28 [ℹ]  building cluster stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:13:29 [ℹ]  deploying stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:13:59 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:14:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:15:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:16:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:17:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:18:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:19:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:20:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:21:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:22:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:23:29 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:25:30 [ℹ]  building managed nodegroup stack "eksctl-demo-upgrade-nodegroup-ng"
2023-08-26 16:25:30 [ℹ]  deploying stack "eksctl-demo-upgrade-nodegroup-ng"
2023-08-26 16:25:30 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-nodegroup-ng"
2023-08-26 16:26:00 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-nodegroup-ng"
2023-08-26 16:26:52 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-nodegroup-ng"
2023-08-26 16:28:09 [ℹ]  waiting for CloudFormation stack "eksctl-demo-upgrade-nodegroup-ng"
2023-08-26 16:28:09 [ℹ]  waiting for the control plane to become ready
2023-08-26 16:28:10 [✔]  saved kubeconfig as "/home/ec2-user/.kube/config"
2023-08-26 16:28:10 [ℹ]  no tasks
2023-08-26 16:28:10 [✔]  all EKS cluster resources for "demo-upgrade" have been created
2023-08-26 16:28:10 [ℹ]  nodegroup "ng" has 1 node(s)
2023-08-26 16:28:10 [ℹ]  node "ip-192-168-78-20.ap-northeast-1.compute.internal" is ready
2023-08-26 16:28:10 [ℹ]  waiting for at least 1 node(s) to become ready in "ng"
2023-08-26 16:28:10 [ℹ]  nodegroup "ng" has 1 node(s)
2023-08-26 16:28:10 [ℹ]  node "ip-192-168-78-20.ap-northeast-1.compute.internal" is ready
2023-08-26 16:28:12 [ℹ]  kubectl command should work with "/home/ec2-user/.kube/config", try 'kubectl get nodes'
2023-08-26 16:28:12 [✔]  EKS cluster "demo-upgrade" in "ap-northeast-1" region is ready
```

2. 查看預設 Kubernetes API server `Service` 及 `Endpoints` list。

```
$ kubectl describe svc kubernetes
Name:              kubernetes
Namespace:         default
Labels:            component=apiserver
                   provider=kubernetes
Annotations:       <none>
Selector:          <none>
Type:              ClusterIP
IP Family Policy:  SingleStack
IP Families:       IPv4
IP:                10.100.0.1
IPs:               10.100.0.1
Port:              https  443/TCP
TargetPort:        443/TCP
Endpoints:         192.168.111.237:443,192.168.145.220:443
Session Affinity:  None
Events:            <none>

$ kubectl get endpoints -o jsonpath='{.items[0].subsets[0].addresses[*]}'
{"ip":"192.168.111.237"} {"ip":"192.168.145.220"}
```

3. 使用 `aws ec2 describe-network-interfaces` 命令，並過濾關聯 ENI 時間。
```
$ aws ec2 describe-network-interfaces --filters Name=addresses.private-ip-address,Values=192.168.111.237,192.168.145.220 --query 'NetworkInterfaces[*][Attachment.AttachTime,Description,PrivateIpAddress]' --output table
-----------------------------------------------------------------------------
|                         DescribeNetworkInterfaces                         |
+---------------------------+---------------------------+-------------------+
|  2023-08-26T16:22:54+00:00|  Amazon EKS demo-upgrade  |  192.168.111.237  |
|  2023-08-26T16:18:29+00:00|  Amazon EKS demo-upgrade  |  192.168.145.220  |
+---------------------------+---------------------------+-------------------+
```

4. 建立以下 Pod `aws-cli.yaml` YAML。
```
$ cat ./aws-cli.yaml
apiVersion: v1
kind: Pod
metadata:
  name: aws-cli
  namespace: default
spec:
  containers:
  - name: aws-cli
    image: amazon/aws-cli:latest
    env:
    - name: APISERVER
      value: "https://kubernetes.default.svc"
    - name: SERVICEACCOUNT
      value: "/var/run/secrets/kubernetes.io/serviceaccount"
    command: ["/scripts/health-check.sh"]
    volumeMounts:
    - name: script
      mountPath: "/scripts"
    imagePullPolicy: IfNotPresent
  volumes:
    - name: script
      configMap:
        name: health-check-dir
        defaultMode: 0500
        items:
          - key: health-check.sh
            path: health-check.sh
  restartPolicy: Always
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: health-check-dir
data:
  health-check.sh: |
    #!/bin/bash
    # set -ex
    NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)
    TOKEN=$(cat ${SERVICEACCOUNT}/token)
    CACERT=${SERVICEACCOUNT}/ca.crt
    for i in {1..1000}; do
      sleep 1;
      DATE=$(date --iso-8601=sec);
      RESPONSE=$(curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" --write-out %{http_code} --silent --output /dev/null --connect-timeout 3 -X GET ${APISERVER}/livez);
      if [ "$RESPONSE" = "200" ];
       then echo "$DATE - API Server is healthy, up and running"
      else
       echo "$DATE - timeout (response code - $RESPONSE)"
       curl -vvv --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" --connect-timeout 1 --silent --output /dev/null -X GET ${APISERVER}/livez?verbose
      fi
    done;
```

5. 建立 Pod `aws-cli`，其建立時間為 `2023-08-26T16:31:36Z`。
```
$ kubectl apply -f ./aws-cli.yaml
pod/aws-cli created
configmap/health-check-dir created

$ kubectl get po -o jsonpath='{.items[].metadata.creationTimestamp}'
2023-08-26T16:31:36Z
```

6. 使用 `eksctl upgrade` 命令將叢集 Kubernetes 1.26 版本升級至 1.27 版本。
```
$ eksctl upgrade cluster --name=demo-upgrade --version=1.27 --approve
2023-08-26 16:31:55 [ℹ]  will upgrade cluster "demo-upgrade" control plane from current version "1.26" to "1.27"
2023-08-26 16:41:13 [✔]  cluster "demo-upgrade" control plane has been upgraded to version "1.27"
2023-08-26 16:41:13 [ℹ]  you will need to follow the upgrade procedure for all of nodegroups and add-ons
2023-08-26 16:41:14 [ℹ]  re-building cluster stack "eksctl-demo-upgrade-cluster"
2023-08-26 16:41:14 [✔]  all resources in cluster stack "eksctl-demo-upgrade-cluster" are up-to-date
2023-08-26 16:41:14 [ℹ]  checking security group configuration for all nodegroups
2023-08-26 16:41:14 [ℹ]  all nodegroups have up-to-date cloudformation templates
```

7. 將 Pod `aws-cli` 記錄檔輸出，並過濾關鍵字 `timeout` 可以觀察到有 6 筆紀錄。

```
$ kubectl logs aws-cli > ./timeout.log

$ grep -B1 -A2 "timeout" ./timeout.log
2023-08-26T16:41:37+0000 - API Server is healthy, up and running
2023-08-26T16:41:38+0000 - timeout (response code - 000)
*   Trying 10.100.0.1:443...
* Connected to kubernetes.default.svc (10.100.0.1) port 443 (#0)
--
2023-08-26T16:41:39+0000 - API Server is healthy, up and running
2023-08-26T16:41:40+0000 - timeout (response code - 000)
*   Trying 10.100.0.1:443...
* Connected to kubernetes.default.svc (10.100.0.1) port 443 (#0)
--
2023-08-26T16:41:42+0000 - API Server is healthy, up and running
2023-08-26T16:41:43+0000 - timeout (response code - 000)
*   Trying 10.100.0.1:443...
* connect to 10.100.0.1 port 443 failed: Connection refused
--
2023-08-26T16:41:44+0000 - API Server is healthy, up and running
2023-08-26T16:41:45+0000 - timeout (response code - 000)
*   Trying 10.100.0.1:443...
* Connected to kubernetes.default.svc (10.100.0.1) port 443 (#0)
--
2023-08-26T16:41:46+0000 - API Server is healthy, up and running
2023-08-26T16:41:47+0000 - timeout (response code - 000)
*   Trying 10.100.0.1:443...
* Connected to kubernetes.default.svc (10.100.0.1) port 443 (#0)
--
2023-08-26T16:41:48+0000 - API Server is healthy, up and running
2023-08-26T16:41:49+0000 - timeout (response code - 000)
*   Trying 10.100.0.1:443...
* Connected to kubernetes.default.svc (10.100.0.1) port 443 (#0)
```

8. 再次檢視 `Service` 及 `Endpoints` kubernetes，觀察 IP 已經更新。
```
$ kubectl describe svc kubernetes
Name:              kubernetes
Namespace:         default
Labels:            component=apiserver
                   provider=kubernetes
Annotations:       <none>
Selector:          <none>
Type:              ClusterIP
IP Family Policy:  SingleStack
IP Families:       IPv4
IP:                10.100.0.1
IPs:               10.100.0.1
Port:              https  443/TCP
TargetPort:        443/TCP
Endpoints:         192.168.149.72:443,192.168.170.240:443
Session Affinity:  None
Events:            <none>

$ kubectl get endpoints kubernetes -o jsonpath='{.items[0].subsets[0].addresses[*]}'
{"ip":"192.168.149.72"} {"ip":"192.168.170.240"}


$ aws ec2 describe-network-interfaces --filters Name=addresses.private-ip-address,Values=192.168.149.72,192.168.170.240 --query 'NetworkInterfaces[*][Attachment.AttachTime,Description,PrivateIpAddress]' --output table
-----------------------------------------------------------------------------
|                         DescribeNetworkInterfaces                         |
+---------------------------+---------------------------+-------------------+
|  2023-08-26T16:40:00+00:00|  Amazon EKS demo-upgrade  |  192.168.149.72   |
|  2023-08-26T16:33:48+00:00|  Amazon EKS demo-upgrade  |  192.168.170.240  |
+---------------------------+---------------------------+-------------------+
```