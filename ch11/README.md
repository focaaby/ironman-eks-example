## 建立 Managed node groups 及 Self-managed node groups

1. 透過 `eksctl` 命令建立新的 managed node group `demo-ng`。
```
$ eksctl create nodegroup --nodes=1 --ssh-access --ssh-public-key=demo --managed --name=demo-ng --cluster=ironman
2023-07-05 22:49:45 [ℹ]  will use version 1.27 for new nodegroup(s) based on control plane version
2023-07-05 22:49:46 [ℹ]  nodegroup "demo-ng" will use "" [AmazonLinux2/1.27]
2023-07-05 22:49:46 [ℹ]  using EC2 key pair %!q(*string=<nil>)
2023-07-05 22:49:46 [ℹ]  1 existing nodegroup(s) (ng1-public-ssh) will be excluded
2023-07-05 22:49:46 [ℹ]  1 nodegroup (demo-ng) was included (based on the include/exclude rules)
2023-07-05 22:49:46 [ℹ]  will create a CloudFormation stack for each of 1 managed nodegroups in cluster "ironman"
2023-07-05 22:49:47 [ℹ]
2 sequential tasks: { fix cluster compatibility, 1 task: { 1 task: { create managed nodegroup "demo-ng" } }
}
2023-07-05 22:49:47 [ℹ]  checking cluster stack for missing resources
2023-07-05 22:49:47 [ℹ]  cluster stack has all required resources
2023-07-05 22:49:47 [ℹ]  building managed nodegroup stack "eksctl-ironman-nodegroup-demo-ng"
2023-07-05 22:49:48 [ℹ]  deploying stack "eksctl-ironman-nodegroup-demo-ng"
2023-07-05 22:49:48 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-ng"
2023-07-05 22:50:18 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-ng"
2023-07-05 22:51:10 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-ng"
2023-07-05 22:51:46 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-ng"
2023-07-05 22:53:06 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-ng"
2023-07-05 22:53:06 [ℹ]  no tasks
2023-07-05 22:53:06 [✔]  created 0 nodegroup(s) in cluster "ironman"
2023-07-05 22:53:06 [ℹ]  nodegroup "demo-ng" has 1 node(s)
2023-07-05 22:53:06 [ℹ]  node "ip-192-168-82-7.eu-west-1.compute.internal" is ready
2023-07-05 22:53:06 [ℹ]  waiting for at least 1 node(s) to become ready in "demo-ng"
2023-07-05 22:53:06 [ℹ]  nodegroup "demo-ng" has 1 node(s)
2023-07-05 22:53:06 [ℹ]  node "ip-192-168-82-7.eu-west-1.compute.internal" is ready
2023-07-05 22:53:06 [✔]  created 1 managed nodegroup(s) in cluster "ironman"
2023-07-05 22:53:07 [ℹ]  checking security group configuration for all nodegroups
2023-07-05 22:53:07 [ℹ]  all nodegroups have up-to-date cloudformation templates
```
2. 透過 `eksctl` 命令建立新的 self-node group `demo-self-ng`。

```
$ ec2-user@ip-172-31-15-47:~$ eksctl create nodegroup --nodes=1 --ssh-access --ssh-public-key=demo --name=demo-self-ng --cluster=ironman --managed=false
2023-07-05 22:50:38 [ℹ]  will use version 1.27 for new nodegroup(s) based on control plane version
2023-07-05 22:50:39 [ℹ]  nodegroup "demo-self-ng" will use "ami-05fb5fbb50e08e8be" [AmazonLinux2/1.27]
2023-07-05 22:50:39 [ℹ]  using EC2 key pair %!q(*string=<nil>)
2023-07-05 22:50:39 [ℹ]  2 existing nodegroup(s) (demo-ng,ng1-public-ssh) will be excluded
2023-07-05 22:50:39 [ℹ]  1 nodegroup (demo-self-ng) was included (based on the include/exclude rules)
2023-07-05 22:50:39 [ℹ]  will create a CloudFormation stack for each of 1 nodegroups in cluster "ironman"
2023-07-05 22:50:40 [ℹ]
2 sequential tasks: { fix cluster compatibility, 1 task: { 1 task: { create nodegroup "demo-self-ng" } }
}
2023-07-05 22:50:40 [ℹ]  checking cluster stack for missing resources
2023-07-05 22:50:40 [ℹ]  cluster stack has all required resources
2023-07-05 22:50:40 [ℹ]  building nodegroup stack "eksctl-ironman-nodegroup-demo-self-ng"
2023-07-05 22:50:40 [ℹ]  --nodes-min=1 was set automatically for nodegroup demo-self-ng
2023-07-05 22:50:40 [ℹ]  --nodes-max=1 was set automatically for nodegroup demo-self-ng
2023-07-05 22:50:40 [ℹ]  deploying stack "eksctl-ironman-nodegroup-demo-self-ng"
2023-07-05 22:50:40 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-self-ng"
2023-07-05 22:51:10 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-self-ng"
2023-07-05 22:52:02 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-self-ng"
2023-07-05 22:52:56 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-self-ng"
2023-07-05 22:54:54 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-demo-self-ng"
2023-07-05 22:54:54 [ℹ]  no tasks
2023-07-05 22:54:54 [ℹ]  adding identity "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-demo-sel-NodeInstanceRole-7P8JQI5W2VFS" to auth ConfigMap
2023-07-05 22:54:54 [ℹ]  nodegroup "demo-self-ng" has 0 node(s)
2023-07-05 22:54:54 [ℹ]  waiting for at least 1 node(s) to become ready in "demo-self-ng"
2023-07-05 22:55:39 [ℹ]  nodegroup "demo-self-ng" has 1 node(s)
2023-07-05 22:55:39 [ℹ]  node "ip-192-168-18-58.eu-west-1.compute.internal" is ready
2023-07-05 22:55:39 [✔]  created 1 nodegroup(s) in cluster "ironman"
2023-07-05 22:55:39 [✔]  created 0 managed nodegroup(s) in cluster "ironman"
2023-07-05 22:55:39 [ℹ]  checking security group configuration for all nodegroups
2023-07-05 22:55:39 [ℹ]  all nodegroups have up-to-date cloudformation templates
```

3. 分別將此兩個節點 label 資訊輸出成 json 格式。

```
$ kubectl get node ip-192-168-82-7.eu-west-1.compute.internal -o json | jq .metadata.labels > managed-labels.json
$ kubectl get node ip-192-168-18-58.eu-west-1.compute.internal -o json | jq .metadata.labels > self-managed-labels.json
```

4. 透過 `diff` 命令比對差異：
```
$ diff managed-labels.json self-managed-labels.json --context
*** managed-labels.json 2023-07-05 22:58:46.217607302 +0000
--- self-managed-labels.json    2023-07-05 22:58:51.633463328 +0000
***************
*** 1,21 ****
  {
    "alpha.eksctl.io/cluster-name": "ironman",
!   "alpha.eksctl.io/nodegroup-name": "demo-ng",
    "beta.kubernetes.io/arch": "amd64",
    "beta.kubernetes.io/instance-type": "m5.large",
    "beta.kubernetes.io/os": "linux",
-   "eks.amazonaws.com/capacityType": "ON_DEMAND",
-   "eks.amazonaws.com/nodegroup": "demo-ng",
-   "eks.amazonaws.com/nodegroup-image": "ami-05fb5fbb50e08e8be",
-   "eks.amazonaws.com/sourceLaunchTemplateId": "lt-00a8d7d3a81de1368",
-   "eks.amazonaws.com/sourceLaunchTemplateVersion": "1",
    "failure-domain.beta.kubernetes.io/region": "eu-west-1",
!   "failure-domain.beta.kubernetes.io/zone": "eu-west-1a",
    "k8s.io/cloud-provider-aws": "65a3fe7010d444e2b6d9d72e9d1f7e67",
    "kubernetes.io/arch": "amd64",
!   "kubernetes.io/hostname": "ip-192-168-82-7.eu-west-1.compute.internal",
    "kubernetes.io/os": "linux",
    "node.kubernetes.io/instance-type": "m5.large",
    "topology.kubernetes.io/region": "eu-west-1",
!   "topology.kubernetes.io/zone": "eu-west-1a"
  }
--- 1,18 ----
  {
    "alpha.eksctl.io/cluster-name": "ironman",
!   "alpha.eksctl.io/instance-id": "i-02bc2f45829b9111f",
!   "alpha.eksctl.io/nodegroup-name": "demo-self-ng",
    "beta.kubernetes.io/arch": "amd64",
    "beta.kubernetes.io/instance-type": "m5.large",
    "beta.kubernetes.io/os": "linux",
    "failure-domain.beta.kubernetes.io/region": "eu-west-1",
!   "failure-domain.beta.kubernetes.io/zone": "eu-west-1c",
    "k8s.io/cloud-provider-aws": "65a3fe7010d444e2b6d9d72e9d1f7e67",
    "kubernetes.io/arch": "amd64",
!   "kubernetes.io/hostname": "ip-192-168-18-58.eu-west-1.compute.internal",
    "kubernetes.io/os": "linux",
+   "node-lifecycle": "on-demand",
    "node.kubernetes.io/instance-type": "m5.large",
    "topology.kubernetes.io/region": "eu-west-1",
!   "topology.kubernetes.io/zone": "eu-west-1c"
  }
```

## 建立 Kubernetes Deployment object 並終止其中一 Managed 節點

1. 透過 kubectl label 過濾 managed node group `demo-ng`。
```
$ kubectl get node -l eks.amazonaws.com/nodegroup=demo-ng
NAME                                          STATUS   ROLES    AGE   VERSION
ip-192-168-95-87.eu-west-1.compute.internal   Ready    <none>   18m   v1.27.1-eks-2f008fe
```
2. 建立以下 nginx-normal.yaml YAML 檔案，並使用 `nodeSelector` 指定 managed node group `demo-ng` 。
```
$ cat ./nginx-normal.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: "demo"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "nginx-demo-deployment"
  namespace: "demo"
  labels:
    app: "nginx-demo"
spec:
  selector:
    matchLabels:
      app: "nginx-demo"
  replicas: 3
  template:
    metadata:
      labels:
        app: "nginx-demo"
    spec:
      nodeSelector:
        eks.amazonaws.com/nodegroup: "demo-ng"
      containers:
      - image: nginx:latest
        imagePullPolicy: Always
        name: "nginx-demo"
        ports:
        - containerPort: 80
```

3. 部署後，並確認 Nginx 測試 Pod 執行於該 managed 節點。
```
$ kubectl apply -f ./nginx-normal.yaml
namespace/demo created
deployment.apps/nginx-demo-deployment created

$ kubectl describe no ip-192-168-95-87.eu-west-1.compute.internal | grep -A 5 "Non-terminated Pods"
Non-terminated Pods:          (5 in total)
  Namespace                   Name                                      CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                                      ------------  ----------  ---------------  -------------  ---
  demo                        nginx-demo-deployment-7d4795b8bb-klqtk    0 (0%)        0 (0%)      0 (0%)           0 (0%)         3m52s
  demo                        nginx-demo-deployment-7d4795b8bb-trfb6    0 (0%)        0 (0%)      0 (0%)           0 (0%)         3m52s
  demo                        nginx-demo-deployment-7d4795b8bb-v77r9    0 (0%)        0 (0%)      0 (0%)           0 (0%)         3m52s
```

4. 為確保終止 node `ip-192-168-95-87.eu-west-1.compute.internal`，透過以下 AWS CLI `terminate-instance-in-auto-scaling-group` 終止 EKS 工作節點同時進行 scale-in 至 0。
```
$ kubectl describe no ip-192-168-95-87.eu-west-1.compute.internal | grep "Provider"
ProviderID:                   aws:///eu-west-1a/i-06da872dc9dbaa06f

$ aws autoscaling terminate-instance-in-auto-scaling-group --instance-id i-06da872dc9dbaa06f --should-decrement-desired-capacity
{
    "Activity": {
        "ActivityId": "906624ec-a426-09cb-a041-a869f7ffb3ff",
        "AutoScalingGroupName": "eks-demo-ng-2ac4941f-d51b-87e0-30e3-fe83f3d78e7f",
        "Description": "Terminating EC2 instance: i-06da872dc9dbaa06f",
        "Cause": "At 2023-07-09T14:58:12Z instance i-06da872dc9dbaa06f was taken out of service in response to a user request, shrinking the capacity from 1 to 0.",
        "StartTime": "2023-07-09T14:58:12.482000+00:00",
        "StatusCode": "InProgress",
        "Progress": 0,
        "Details": "{\"Subnet ID\":\"subnet-048887619acde4951\",\"Availability Zone\":\"eu-west-1a\"}"
    }
}
```
