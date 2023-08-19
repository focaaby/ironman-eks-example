# 建立 Fargate 環境

在建立 EKS 叢集時，並未先建立 Fargate Profile 設定檔，因此我們需要先根據 [文件](https://docs.aws.amazon.com/eks/latest/userguide/fargate-getting-started.html) 步驟設定此環境。

1. 建立 Fargate Profile 並指定 namespace 名稱為 `fargate-demo`。
```
$ eksctl create fargateprofile \
    --cluster ironman \
    --name demo-profile \
    --namespace fargate-demo
2023-06-17 14:33:44 [ℹ]  creating Fargate profile "demo-profile" on EKS cluster "ironman"
2023-06-17 14:35:54 [ℹ]  created Fargate profile "demo-profile" on EKS cluster "ironman"

$ eksctl get fargateprofile --cluster ironman
NAME            SELECTOR_NAMESPACE      SELECTOR_LABELS POD_EXECUTION_ROLE_ARN                                                                          SUBNETS                                                                      TAGS     STATUS
demo-profile    fargate-demo            <none>          arn:aws:iam::111111111111:role/eksctl-ironman-fargate-FargatePodExecutionRole-ENO8G7C1URR3      subnet-0d9124ff945abf078,subnet-02c56accde0e19679,subnet-0a3ab95cd4fece9d2   <none>   ACTIVE

$ aws eks describe-fargate-profile --cluster-name ironman --fargate-profile-name demo-profile
{
    "fargateProfile": {
        "fargateProfileName": "demo-profile",
        "fargateProfileArn": "arn:aws:eks:eu-west-1:111111111111:fargateprofile/ironman/demo-profile/28c464e3-5e56-0a4a-59e2-c971885c7c45",
        "clusterName": "ironman",
        "createdAt": "2023-06-17T14:33:46.240000+00:00",
        "podExecutionRoleArn": "arn:aws:iam::111111111111:role/eksctl-ironman-fargate-FargatePodExecutionRole-ENO8G7C1URR3",
        "subnets": [
            "subnet-0d9124ff945abf078",
            "subnet-02c56accde0e19679",
            "subnet-0a3ab95cd4fece9d2"
        ],
        "selectors": [
            {
                "namespace": "fargate-demo"
            }
        ],
        "status": "ACTIVE",
        "tags": {}
    }
}
```
2. 建立 fargate-ns namepsace。
```
$ kubectl create ns fargate-demo
```

## 驗證

分別建立 Nginx 作為測試容器於 EC2 EKS 工作節點及 Fargate 上來進行比對：

1. 透過 kubectl 建立 Nginx Pod 於 fargate-demo 及 default namespace。

```
$ kubectl run nginx --image=nginx -n fargate-demo
$ kubectl run nginx --image=nginx -n default
```
2. 將 Pod 資訊輸出成 YAML 文件。
```
$ kubectl -n default get po nginx -o yaml > default-nginx.yaml
$ kubectl -n fargate-demo get po nginx -o yaml > fargate-nginx.yaml
```

3. 透過 `diff` 命令比對，以下僅列舉較大差異部分，其他如時間戳記或是 namespace 不同處則省略。

```
$ diff fargate-nginx.yaml default-nginx.yaml
4,7c4
<   annotations: ➊
<     CapacityProvisioned: 0.25vCPU 0.5GB
<     Logging: 'LoggingDisabled: LOGGING_CONFIGMAP_NOT_FOUND'
<   creationTimestamp: "2023-06-17T14:55:20Z"
---
>   creationTimestamp: "2023-06-17T14:55:25Z"
9d5
<     eks.amazonaws.com/fargate-profile: demo-profile ➋
12,14c8,10
<   namespace: fargate-demo
<   resourceVersion: "4443117"
<   uid: 4184ce03-1bf0-4969-bc5f-887178c5ed44
---
>   namespace: default
>   resourceVersion: "4442991"
>   uid: 9d5c2209-2bdf-40b3-ae39-8ea6c55a470e
25c21
<       name: kube-api-access-j97vj
---
>       name: kube-api-access-pvvqv
29c25
<   nodeName: fargate-ip-192-168-140-92.eu-west-1.compute.internal ➌
---
>   nodeName: ip-192-168-59-127.eu-west-1.compute.internal
31,32c27
<   priority: 2000001000
<   priorityClassName: system-node-critical
---
>   priority: 0
34c29
<   schedulerName: fargate-scheduler ❹
---
>   schedulerName: default-scheduler
49c44
<   - name: kube-api-access-j97vj
---
>   - name: kube-api-access-pvvqv
70c65
<     lastTransitionTime: "2023-06-17T14:55:54Z"
---
>     lastTransitionTime: "2023-06-17T14:55:25Z"
74c69
<     lastTransitionTime: "2023-06-17T14:56:01Z"
---
>     lastTransitionTime: "2023-06-17T14:55:31Z"
78c73
<     lastTransitionTime: "2023-06-17T14:56:01Z"
---
>     lastTransitionTime: "2023-06-17T14:55:31Z"
82c77
<     lastTransitionTime: "2023-06-17T14:55:53Z"
---
>     lastTransitionTime: "2023-06-17T14:55:25Z"
86c81
<   - containerID: containerd://3d55c5046dd0ec8ffdc733b27dc1c8655850bc0092b963f19d1e96db39524c7f
---
>   - containerID: containerd://aa327873087efcc7166b61d4048b31947bf36da8c4a6bd369de6c9149edf81ad
96,97c91,92
<         startedAt: "2023-06-17T14:56:01Z"
<   hostIP: 192.168.140.92
---
>         startedAt: "2023-06-17T14:55:30Z"
>   hostIP: 192.168.59.127
99c94
<   podIP: 192.168.140.92
---
>   podIP: 192.168.33.38
101c96
<   - ip: 192.168.140.92
---
>   - ip: 192.168.33.38
103c98
<   startTime: "2023-06-17T14:55:54Z"
---
>   startTime: "2023-06-17T14:55:25Z"
```
