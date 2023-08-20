## 建置 IRSA 環境

1. 於本地建立以下 IAM policy 並儲存為 `s3-example-iam-policy.json` 檔案。

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::*"
        }
    ]
}
```
2. 透過 AWS CLI `aws iam create-policy` 命令建立 IAM Policy。

```
$ aws iam create-policy --policy-name ironman-s3-example --policy-document file://s3-example-iam-policy.json
{
    "Policy": {
        "PolicyName": "ironman-s3-example",
        "PolicyId": "ANPAYFMQSNSEYJAANDYSB",
        "Arn": "arn:aws:iam::111111111111:policy/ironman-s3-example",
        "Path": "/",
        "DefaultVersionId": "v1",
        "AttachmentCount": 0,
        "PermissionsBoundaryUsageCount": 0,
        "IsAttachable": true,
        "CreateDate": "2023-07-03T16:22:43+00:00",
        "UpdateDate": "2023-07-03T16:22:43+00:00"
    }
}
```

3. 透過 `eksctl` 命令建立 Kubernetes Service Account 及 IAM role。此會透過 CloudFormation 服務建立 IAM role。
```
$ eksctl create iamserviceaccount \
  --name ironman-s3-sa \
  --namespace default \
  --cluster ironman \
  --attach-policy-arn arn:aws:iam::111111111111:policy/ironman-s3-example \
  --approve
2023-07-03 16:23:24 [ℹ]  1 existing iamserviceaccount(s) (kube-system/aws-node) will be excluded
2023-07-03 16:23:24 [ℹ]  1 iamserviceaccount (default/ironman-s3-sa) was included (based on the include/exclude rules)
2023-07-03 16:23:24 [!]  serviceaccounts that exist in Kubernetes will be excluded, use --override-existing-serviceaccounts to override
2023-07-03 16:23:24 [ℹ]  1 task: {
    2 sequential sub-tasks: {
        create IAM role for serviceaccount "default/ironman-s3-sa",
        create serviceaccount "default/ironman-s3-sa",
    } }2023-07-03 16:23:24 [ℹ]  building iamserviceaccount stack "eksctl-ironman-addon-iamserviceaccount-default-ironman-s3-sa"
2023-07-03 16:23:24 [ℹ]  deploying stack "eksctl-ironman-addon-iamserviceaccount-default-ironman-s3-sa"
2023-07-03 16:23:24 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-default-ironman-s3-sa"
2023-07-03 16:23:54 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-default-ironman-s3-sa"
2023-07-03 16:23:54 [ℹ]  created serviceaccount "default/ironman-s3-sa"
```

4. 使用 AWS CLI image 作為測試 Pod 並關聯 Service Account `ironman-s3-sa`。
```
$ kubectl run aws-cli --image="amazon/aws-cli" --command sleep infinity --overrides='{ "spec": { "serviceAccountName": "ironman-s3-sa" } }'
```

## Pod aws-cli
```
$ kubectl describe po aws-cli
Name:             aws-cli
Namespace:        default
Priority:         0
Service Account:  ironman-s3-sa
Node:             ip-192-168-45-208.eu-west-1.compute.internal/192.168.45.208
Start Time:       Mon, 03 Jul 2023 16:33:21 +0000
Labels:           run=aws-cli
Annotations:      <none>
Status:           Running
IP:               192.168.37.0
IPs:
  IP:  192.168.37.0
Containers:
  aws-cli:
    Container ID:  containerd://bf87fa4009ed55eb9f99935645294fa52a016483380c61b177cb6b7df86fc6a4
    Image:         amazon/aws-cli
    Image ID:      docker.io/amazon/aws-cli@sha256:76073fb39c6c903ec849a29234d098105ee2bff4a391513ddae80578c1247191
    Port:          <none>
    Host Port:     <none>
    Command:
      sleep
      infinity
    State:          Running
      Started:      Mon, 03 Jul 2023 16:33:23 +0000
    Ready:          True
    Restart Count:  0
    Environment:
      AWS_STS_REGIONAL_ENDPOINTS:   regional
      AWS_DEFAULT_REGION:           eu-west-1
      AWS_REGION:                   eu-west-1
      AWS_ROLE_ARN:                 arn:aws:iam::111111111111:role/eksctl-ironman-addon-iamserviceaccount-defau-Role1-1D8NH64CZ7VFB
      AWS_WEB_IDENTITY_TOKEN_FILE:  /var/run/secrets/eks.amazonaws.com/serviceaccount/token
    Mounts:
      /var/run/secrets/eks.amazonaws.com/serviceaccount from aws-iam-token (ro)
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-rzdtz (ro)
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
Volumes:
  aws-iam-token:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  86400
  kube-api-access-rzdtz:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  2m6s  default-scheduler  Successfully assigned default/aws-cli to ip-192-168-45-208.eu-west-1.compute.internal
  Normal  Pulling    2m5s  kubelet            Pulling image "amazon/aws-cli"
  Normal  Pulled     2m4s  kubelet            Successfully pulled image "amazon/aws-cli" in 569.674479ms (569.693995ms including waiting)
  Normal  Created    2m4s  kubelet            Created container aws-cli
  Normal  Started    2m4s  kubelet            Started container aws-cli
