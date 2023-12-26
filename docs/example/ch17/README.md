# 建置環境

1. 檢視 VPC CNI plugin 版本。當前測試版本為 `v1.12.6`。

    ```bash
    $ kubectl describe daemonset aws-node --namespace kube-system | grep Image | cut -d "/" -f 2
    amazon-k8s-cni-init:v1.12.6-eksbuild.2
    amazon-k8s-cni:v1.12.6-eksbuild.2
    ```

2. 查看叢集所使用的 [EKS cluster IAM role](https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html) [^1]。

    ```bash
    $ aws eks describe-cluster --name ironman --query cluster.roleArn --output text
    arn:aws:iam::111111111111:role/eksctl-ironman-cluster-ServiceRole-1KZA9GL6BA7OQ
    ```

3. 將 IAM sPolicy `AmazonEKSVPCResourceController` 關聯至 EKS 叢集 IAM role。

    ```bash
    aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AmazonEKSVPCResourceController --role-name eksctl-ironman-cluster-ServiceRole-1KZA9GL6BA7OQ
    ```

4. 設定 `DaemonSet` `aws-node`環境變數 `ENABLE_POD_ENI` 為 `true`。

    ```bash
    $ kubectl set env daemonset aws-node -n kube-system ENABLE_POD_ENI=true
    daemonset.apps/aws-node env updated
    ```

5. 設定環境變數將會導致 Pod 重啟。等候數秒後，可以觀察到節點更新 label `vpc.amazonaws.com/has-trunk-attached`。

    ```bash
    $ kubectl -n kube-system get po | grep "aws-node"
    aws-node-2frfg             1/1     Running   0          41s
    aws-node-x769d             1/1     Running   0          38s

    $ kubectl get nodes -l vpc.amazonaws.com/has-trunk-attached=true
    NAME                                                STATUS   ROLES    AGE   VERSION
    ip-192-168-18-171.eu-west-1.compute.internal   Ready    <none>   25h   v1.27.3-eks-a5565ad
    ip-192-168-34-221.eu-west-1.compute.internal   Ready    <none>   7d    v1.27.3-eks-a5565ad
    ```

6. 建立以下 `sg-policy-demo.yaml`，以下使用 image `aws-cli` 建立測試 Pod。

    ```bash
    $ cat ./sg-policy-demo.yaml
    apiVersion: vpcresources.k8s.aws/v1beta1
    kind: SecurityGroupPolicy
    metadata:
      name: my-security-group-policy-demo
      namespace: default
    spec:
      podSelector:
        matchLabels:
          role: demo-sg
      securityGroups:
        groupIds:
          - sg-01d949d847be58d1c
    ---
    apiVersion: v1
    kind: Pod
    metadata:
      name: aws-cli
      namespace: default
      labels:
        role: demo-sg
    spec:
      containers:
      - name: aws-cli
        image: amazon/aws-cli:latest
        command:
          - sleep
          - infinity
        imagePullPolicy: IfNotPresent
      restartPolicy: Always
    ```

7. 部署 `SecurityGroupPolicy` 及 `Pod`。

    ```bash
    $ kubectl apply -f ./sg-policy-demo.yaml
    securitygrouppolicy.vpcresources.k8s.aws/my-security-group-policy-demo created
    pod/aws-cli created
    ```

## Node information

```bash
$ kubectl describe no ip-192-168-18-171.eu-west-1.compute.internal
Name:               ip-192-168-18-171.eu-west-1.compute.internal
Roles:              <none>
Labels:             alpha.eksctl.io/cluster-name=ironman
                    alpha.eksctl.io/nodegroup-name=ng1-public-ssh
                    beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/instance-type=m5.large
                    beta.kubernetes.io/os=linux
                    eks.amazonaws.com/capacityType=ON_DEMAND
                    eks.amazonaws.com/nodegroup=ng1-public-ssh
                    eks.amazonaws.com/nodegroup-image=ami-0a016581e77d37fab
                    eks.amazonaws.com/sourceLaunchTemplateId=lt-093b385299432df9d
                    eks.amazonaws.com/sourceLaunchTemplateVersion=1
                    failure-domain.beta.kubernetes.io/region=eu-west-1
                    failure-domain.beta.kubernetes.io/zone=eu-west-1c
                    k8s.io/cloud-provider-aws=65a3fe7010d444e2b6d9d72e9d1f7e67
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=ip-192-168-18-171.eu-west-1.compute.internal
                    kubernetes.io/os=linux
                    node.kubernetes.io/instance-type=m5.large
                    topology.kubernetes.io/region=eu-west-1
                    topology.kubernetes.io/zone=eu-west-1c
                    vpc.amazonaws.com/has-trunk-attached=true
Annotations:        alpha.kubernetes.io/provided-node-ip: 192.168.18.171
                    node.alpha.kubernetes.io/ttl: 0
                    volumes.kubernetes.io/controller-managed-attach-detach: true
CreationTimestamp:  Thu, 17 Aug 2023 06:15:09 +0000
Taints:             <none>
Unschedulable:      false
Lease:
  HolderIdentity:  ip-192-168-18-171.eu-west-1.compute.internal
  AcquireTime:     <unset>
  RenewTime:       Fri, 18 Aug 2023 07:44:14 +0000
Conditions:
  Type             Status  LastHeartbeatTime                 LastTransitionTime                Reason                       Message
  ----             ------  -----------------                 ------------------                ------                       -------
  MemoryPressure   False   Fri, 18 Aug 2023 07:43:38 +0000   Thu, 17 Aug 2023 06:15:05 +0000   KubeletHasSufficientMemory   kubelet has sufficient memory available
  DiskPressure     False   Fri, 18 Aug 2023 07:43:38 +0000   Thu, 17 Aug 2023 06:15:05 +0000   KubeletHasNoDiskPressure     kubelet has no disk pressure
  PIDPressure      False   Fri, 18 Aug 2023 07:43:38 +0000   Thu, 17 Aug 2023 06:15:05 +0000   KubeletHasSufficientPID      kubelet has sufficient PID available
  Ready            True    Fri, 18 Aug 2023 07:43:38 +0000   Thu, 17 Aug 2023 06:15:24 +0000   KubeletReady                 kubelet is posting ready status
Addresses:
  InternalIP:   192.168.18.171
  ExternalIP:   54.178.97.169
  InternalDNS:  ip-192-168-18-171.eu-west-1.compute.internal
  Hostname:     ip-192-168-18-171.eu-west-1.compute.internal
  ExternalDNS:  ec2-54-178-97-169.eu-west-1.compute.amazonaws.com
Capacity:
  cpu:                        2
  ephemeral-storage:          83873772Ki
  hugepages-1Gi:              0
  hugepages-2Mi:              0
  memory:                     7824344Ki
  pods:                       29
  vpc.amazonaws.com/pod-eni:  9
Allocatable:
  cpu:                        1930m
  ephemeral-storage:          76224326324
  hugepages-1Gi:              0
  hugepages-2Mi:              0
  memory:                     7134168Ki
  pods:                       29
  vpc.amazonaws.com/pod-eni:  9
System Info:
  Machine ID:                 ec2b62789f2673669a47b24616b14305
  System UUID:                ec2b6278-9f26-7366-9a47-b24616b14305
  Boot ID:                    0cf54759-2e25-4b29-b4d8-17a327073b86
  Kernel Version:             5.10.184-175.749.amzn2.x86_64
  OS Image:                   Amazon Linux 2
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  containerd://1.6.19
  Kubelet Version:            v1.27.3-eks-a5565ad
  Kube-Proxy Version:         v1.27.3-eks-a5565ad
ProviderID:                   aws:///eu-west-1c/i-00018772909497f61
Non-terminated Pods:          (4 in total)
  Namespace                   Name                        CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                        ------------  ----------  ---------------  -------------  ---
  default                     aws-cli                     0 (0%)        0 (0%)      0 (0%)           0 (0%)         11m
  kube-system                 aws-node-2frfg              25m (1%)      0 (0%)      0 (0%)           0 (0%)         16m
  kube-system                 coredns-66984db76b-2phz5    100m (5%)     0 (0%)      70Mi (1%)        170Mi (2%)     75m
  kube-system                 kube-proxy-cpvk9            100m (5%)     0 (0%)      0 (0%)           0 (0%)         25h
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource                   Requests    Limits
  --------                   --------    ------
  cpu                        225m (11%)  0 (0%)
  memory                     70Mi (1%)   170Mi (2%)
  ephemeral-storage          0 (0%)      0 (0%)
  hugepages-1Gi              0 (0%)      0 (0%)
  hugepages-2Mi              0 (0%)      0 (0%)
  vpc.amazonaws.com/pod-eni  1           1
Events:
  Type    Reason              Age   From                     Message
  ----    ------              ----  ----                     -------
  Normal  NodeTrunkInitiated  16m   vpc-resource-controller  The node has trunk interface initialized successfully
```

### branch interface

```bash
$ aws ec2 describe-network-interfaces --network-interface-ids eni-047ff73e04f5b733c
{
    "NetworkInterfaces": [
        {
            "AvailabilityZone": "eu-west-1c",
            "Description": "aws-k8s-branch-eni",
            "Groups": [
                {
                    "GroupName": "default",
                    "GroupId": "sg-01d949d847be58d1c"
                }
            ],
            "InterfaceType": "branch",
            "Ipv6Addresses": [],
            "MacAddress": "0a:59:43:ab:4a:81",
            "NetworkInterfaceId": "eni-047ff73e04f5b733c",
            "OwnerId": "111111111111",
            "PrivateDnsName": "ip-192-168-29-178.eu-west-1.compute.internal",
            "PrivateIpAddress": "192.168.29.178",
            "PrivateIpAddresses": [
                {
                    "Primary": true,
                    "PrivateDnsName": "ip-192-168-29-178.eu-west-1.compute.internal",
                    "PrivateIpAddress": "192.168.29.178"
                }
            ],
            "RequesterId": "895095153028",
            "RequesterManaged": false,
            "SourceDestCheck": true,
            "Status": "in-use",
            "SubnetId": "subnet-0699b5b8ff97ac92d",
            "TagSet": [
                {
                    "Key": "vpcresources.k8s.aws/vlan-id",
                    "Value": "1"
                },
                {
                    "Key": "vpcresources.k8s.aws/trunk-eni-id",
                    "Value": "eni-03e61f90252a662d1"
                },
                {
                    "Key": "eks:eni:owner",
                    "Value": "eks-vpc-resource-controller"
                },
                {
                    "Key": "kubernetes.io/cluster/ironman",
                    "Value": "owned"
                }
            ],
            "VpcId": "vpc-0c135279d2fedea3d"
        }
    ]
}
```

### trunk interface

```bash
$ aws ec2 describe-network-interfaces --network-interface-ids eni-03e61f90252a662d1
{
    "NetworkInterfaces": [
        {
            "Attachment": {
                "AttachTime": "2023-08-18T07:27:41+00:00",
                "AttachmentId": "eni-attach-003f2b4fdcff1d81b",
                "DeleteOnTermination": true,
                "DeviceIndex": 2,
                "NetworkCardIndex": 0,
                "InstanceId": "i-00018772909497f61",
                "InstanceOwnerId": "111111111111",
                "Status": "attached"
            },
            "AvailabilityZone": "eu-west-1c",
            "Description": "aws-k8s-trunk-eni",
            "Groups": [
                {
                    "GroupName": "eksctl-ironman-nodegroup-ng1-public-ssh-remoteAccess",
                    "GroupId": "sg-0a48a1b77f21917a1"
                },
                {
                    "GroupName": "eks-cluster-sg-ironman-2068224914",
                    "GroupId": "sg-0ed34525adc737837"
                }
            ],
            "InterfaceType": "trunk",
            "Ipv6Addresses": [],
            "MacAddress": "0a:69:9e:6b:0c:0f",
            "NetworkInterfaceId": "eni-03e61f90252a662d1",
            "OwnerId": "111111111111",
            "PrivateDnsName": "ip-192-168-13-247.eu-west-1.compute.internal",
            "PrivateIpAddress": "192.168.13.247",
            "PrivateIpAddresses": [
                {
                    "Primary": true,
                    "PrivateDnsName": "ip-192-168-13-247.eu-west-1.compute.internal",
                    "PrivateIpAddress": "192.168.13.247"
                }
            ],
            "RequesterId": "895095153028",
            "RequesterManaged": false,
            "SourceDestCheck": true,
            "Status": "in-use",
            "SubnetId": "subnet-0699b5b8ff97ac92d",
            "TagSet": [
                {
                    "Key": "eks:eni:owner",
                    "Value": "eks-vpc-resource-controller"
                },
                {
                    "Key": "kubernetes.io/cluster/ironman",
                    "Value": "owned"
                }
            ],
            "VpcId": "vpc-0c135279d2fedea3d"
        }
    ]
}
```

## 參考文件

[^1]: [Amazon EKS cluster IAM role](https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html)
