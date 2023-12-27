# Ch9 建立 Fargate 環境

建立測試 Pod 於 Fargate 環境上

## 建立 Fargate 環境

在建立 EKS 叢集時，並未先建立 Fargate Profile 設定檔，因此我們需要先根據 [文件](https://docs.aws.amazon.com/eks/latest/userguide/fargate-getting-started.html) 步驟設定此環境。

1. 建立 Fargate Profile 並指定 namespace 名稱為 `fargate-demo`。

    ```bash
    $ eksctl create fargateprofile \
        --cluster ironman \
        --name demo-profile \
        --namespace fargate-demo
    2023-09-05 10:04:00 [ℹ]  deploying stack "eksctl-ironman-fargate"
    2023-09-05 10:04:00 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-fargate"
    2023-09-05 10:04:30 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-fargate"
    2023-09-05 10:04:31 [ℹ]  creating Fargate profile "demo-profile" on EKS cluster "ironman"
    2023-09-05 10:08:50 [ℹ]  created Fargate profile "demo-profile" on EKS cluster "ironman"

    $ eksctl get fargateprofile --cluster ironman
    NAME            SELECTOR_NAMESPACE      SELECTOR_LABELS POD_EXECUTION_ROLE_ARN                                                                       SUBNETS                                                                          TAGS    STATUS
    demo-profile    fargate-demo            <none>          arn:aws:iam::111111111111:role/eksctl-ironman-fargate-FargatePodExecutionRole-5PV0U75S2IPH   subnet-07f96b19d78fdbb00,subnet-0a018cbbf97412fc8,subnet-06d094e3de1b4f3cf       <none>  ACTIVE

    $ aws eks describe-fargate-profile --cluster-name ironman --fargate-profile-name demo-profile
    {
        "fargateProfile": {
            "fargateProfileName": "demo-profile",
            "fargateProfileArn": "arn:aws:eks:eu-west-1:111111111111:fargateprofile/ironman/demo-profile/52c53266-80a0-9f2a-483d-d3589790ece4",
            "clusterName": "ironman",
            "createdAt": "2023-09-05T10:04:34.053000+00:00",
            "podExecutionRoleArn": "arn:aws:iam::111111111111:role/eksctl-ironman-fargate-FargatePodExecutionRole-5PV0U75S2IPH",
            "subnets": [
                "subnet-07f96b19d78fdbb00",
                "subnet-0a018cbbf97412fc8",
                "subnet-06d094e3de1b4f3cf"
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

    ```bash
    $ kubectl create ns fargate-demo
    namespace/fargate-demo created
    ```

## 驗證

分別使用 Nginx image 作為測試容器於 EC2 EKS 工作節點及 Fargate 上來進行比對：

1. 透過 kubectl 建立 Nginx Pod 於 fargate-demo 及 default namespace。

    ```bash
    $ kubectl run nginx --image=nginx -n fargate-demo
    pod/nginx created

    $ kubectl run nginx --image=nginx -n default
    pod/nginx created
    ```

2. 將 Pod 資訊輸出成 YAML 文件。

    ```bash
    kubectl -n default get po nginx -o yaml > default-nginx.yaml
    kubectl -n fargate-demo get po nginx -o yaml > fargate-nginx.yaml
    ```

3. 透過 `diff` 命令比對：

    ```bash
    $ diff fargate-nginx.yaml default-nginx.yaml
    4,7c4
    <   annotations:
    <     CapacityProvisioned: 0.25vCPU 0.5GB
    <     Logging: 'LoggingDisabled: LOGGING_CONFIGMAP_NOT_FOUND'
    <   creationTimestamp: "2023-09-05T10:11:33Z"
    ---
    >   creationTimestamp: "2023-09-05T10:11:42Z"
    9d5
    <     eks.amazonaws.com/fargate-profile: demo-profile
    12,14c8,10
    <   namespace: fargate-demo
    <   resourceVersion: "5967669"
    <   uid: 399813c4-9f59-4fbc-ab45-f2d8ddf77df6
    ---
    >   namespace: default
    >   resourceVersion: "5967486"
    >   uid: a982f8b2-3f49-4ff9-a02b-0ac443a402f3
    25c21
    <       name: kube-api-access-4z6qt
    ---
    >       name: kube-api-access-bsspj
    29c25
    <   nodeName: fargate-ip-192-168-125-232.eu-west-1.compute.internal
    ---
    >   nodeName: ip-192-168-61-195.eu-west-1.compute.internal
    31,32c27
    <   priority: 2000001000
    <   priorityClassName: system-node-critical
    ---
    >   priority: 0
    34c29
    <   schedulerName: fargate-scheduler
    ---
    >   schedulerName: default-scheduler
    49c44
    <   - name: kube-api-access-4z6qt
    ---
    >   - name: kube-api-access-bsspj
    70c65
    <     lastTransitionTime: "2023-09-05T10:12:19Z"
    ---
    >     lastTransitionTime: "2023-09-05T10:11:42Z"
    74c69
    <     lastTransitionTime: "2023-09-05T10:12:28Z"
    ---
    >     lastTransitionTime: "2023-09-05T10:11:49Z"
    78c73
    <     lastTransitionTime: "2023-09-05T10:12:28Z"
    ---
    >     lastTransitionTime: "2023-09-05T10:11:49Z"
    82c77
    <     lastTransitionTime: "2023-09-05T10:12:18Z"
    ---
    >     lastTransitionTime: "2023-09-05T10:11:42Z"
    86c81
    <   - containerID: containerd://86443e084c72502ca087a7d7df2ea80927b526518c046bdafcb45784eeb92102
    ---
    >   - containerID: containerd://e9ac5b39ab576c1665d55d35b69787642799379f31000566a1ec7a7e1595e0ec
    96,97c91,92
    <         startedAt: "2023-09-05T10:12:28Z"
    <   hostIP: 192.168.125.232
    ---
    >         startedAt: "2023-09-05T10:11:49Z"
    >   hostIP: 192.168.61.195
    99c94
    <   podIP: 192.168.125.232
    ---
    >   podIP: 192.168.35.142
    101c96
    <   - ip: 192.168.125.232
    ---
    >   - ip: 192.168.35.142
    103c98
    <   startTime: "2023-09-05T10:12:19Z"
    ---
    >   startTime: "2023-09-05T10:11:42Z"
    ```
