# iThome 鐵人講堂

1. 建立 cluster。

  ```
  $ eksctl create cluster --with-oidc \
    --ssh-access --ssh-public-key=maowang-nics \
    --nodegroup-name=demo-ng --name=demo
  ```

2. 建立 `eks-pod-identity-agent` addon。

  ```
  $ eksctl create addon --cluster demo --name eks-pod-identity-agent
  ```

  ```
  # 確認 eks-pod-identity-agent 已經被部署成功
  [ec2-user@ip-172-31-8-62 ~]$ kubectl -n kube-system  get ds
  NAME                     DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
  aws-node                 2         2         2       2            2           <none>          30h
  eks-pod-identity-agent   2         2         2       2            2           <none>          30h
  kube-proxy               2         2         2       2            2           <none>          30h
  ```

3. 建立以下 iam-policy.json，此範例提供 `DescribeInstances` API 權限。

  ```
  $ cat ./iam-policy.json
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "ec2:DescribeInstances"
              ],
              "Resource": "*"
          }
      ]
  }
  ```

4. 使用 AWS CLI 建立 IAM Policy。

  ```
  $ aws iam create-policy \
      --policy-name demo-describe-ec2 \
      --policy-document file://iam-policy.json
  {
      "Policy": {
          "PolicyName": "demo-describe-ec2",
          "PolicyId": "ANPAUU2VK5QEAM7SX6T2P",
          "Arn": "arn:aws:iam::319617166344:policy/demo-describe-ec2",
          "Path": "/",
          "DefaultVersionId": "v1",
          "AttachmentCount": 0,
          "PermissionsBoundaryUsageCount": 0,
          "IsAttachable": true,
          "CreateDate": "2024-05-24T11:19:58+00:00",
          "UpdateDate": "2024-05-24T11:19:58+00:00"
      }
  }
  ```

5. 使用 `eksctl` 命令建立 pod identity association，也可以使用 `aws eks create-pod-identity-association` 命令。

  ```
  $ eksctl create podidentityassociation \
  --cluster demo \
  --namespace default \
  --service-account-name ec2-describer \
  --permission-policy-arns="arn:aws:iam::319617166344:policy/demo-describe-ec2"
  2024-05-24 11:24:13 [ℹ]  1 task: {
      3 sequential sub-tasks: {
          create IAM role for pod identity association for service account "default/ec2-describer",
          create service account "default/ec2-describer", if it does not already exist,
          create pod identity association for service account "default/ec2-describer",
      } }2024-05-24 11:24:13 [ℹ]  deploying stack "eksctl-demo-podidentityrole-default-ec2-describer"
  2024-05-24 11:24:13 [ℹ]  waiting for CloudFormation stack "eksctl-demo-podidentityrole-default-ec2-describer"
  2024-05-24 11:24:43 [ℹ]  waiting for CloudFormation stack "eksctl-demo-podidentityrole-default-ec2-describer"
  2024-05-24 11:24:43 [ℹ]  created serviceaccount "default/ec2-describer"
  2024-05-24 11:24:45 [ℹ]  created pod identity association for service account "ec2-describer" in namespace "default"
  2024-05-24 11:24:45 [ℹ]  all tasks were completed successfully
  ```

6. 分別使用 describe-instances 確認權限。使用 `aws sts get-caller-identity` 確認權限為 podidentityrole 所關聯的 IAM role。

  ```
  $ kubectl exec -it aws-cli -- aws ec2 describe-instances --instance-ids i-015a03c4ff7f3b6c1
  {
      "Reservations": [
          {
              "Groups": [],
              "Instances": [
                  {
                      "AmiLaunchIndex": 0,
                      "ImageId": "ami-0fcf1b9f7ff3e462c",
                      "InstanceId": "i-015a03c4ff7f3b6c1",
                    ...
                    ...
                    ...

  $ kubectl exec -it aws-cli -- aws sts get-caller-identity
  {
      "UserId": "AROAUU2VK5QEPJCRS7HTA:eks-demo-aws-cli-b307fd36-d25c-49f1-b9ce-bf4629564f3c",
      "Account": "319617166344",
      "Arn": "arn:aws:sts::319617166344:assumed-role/eksctl-demo-podidentityrole-default-ec2-descr-Role1-9YWIdz5W09wm/eks-demo-aws-cli-b307fd36-d25c-49f1-b9ce-bf4629564f3c"
  }
  ```

## 驗證

1. 檢視 Pod 資訊。
2.
  ```
  $ kubectl describe po aws-cli
  ...
  ...
  Containers:
    aws-cli:
      Container ID:
      Image:         amazon/aws-cli:latest
      Image ID:
      Port:          <none>
      Host Port:     <none>
      Command:
        sleep
        3600
      State:          Waiting
        Reason:       ContainerCreating
      Ready:          False
      Restart Count:  0
      Environment:
        AWS_STS_REGIONAL_ENDPOINTS:              regional
        AWS_DEFAULT_REGION:                      ap-northeast-1
        AWS_REGION:                              ap-northeast-1
        AWS_CONTAINER_CREDENTIALS_FULL_URI:      http://169.254.170.23/v1/credentials
        AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE:  /var/run/secrets/pods.eks.amazonaws.com/serviceaccount/eks-pod-identity-token
      Mounts:
        /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-hhs5j (ro)
        /var/run/secrets/pods.eks.amazonaws.com/serviceaccount from eks-pod-identity-token
  ```

1. 看一下 eks-pod-identity-token / env variable `AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE` 是什麼，格式為 jwt base64 encode 格式。

  ```
  $ kubectl exec -it aws-cli -- cat /var/run/secrets/pods.eks.amazonaws.com/serviceaccount/eks-pod-identity-token; echo
  eyJhbGciOiJSUzI1NiIsImtpZCI6IjJiYzYyODViNWI3NWU4NzljZmVmZWQ2NDUwZjgxOGMxOTBkZGY4YzUifQ.eyJhdWQ...XIifQ.LGumVtChwoZ1ZUXbc53hiK8gDqKeqrfPu--11iJgxuM1R0RKOcjBuJfNQ9QdlSpyXQHgNpciHjwujXbnWPI5vaSK4tNKyx2IoO2UQGu_kkW4vxVQ0axdedQB7dLJHvBdNQ3sTCiom5HsJj1d1lsSDJN0-KVOaAhxb444inyIp5z8zeKMi2rpKU1Lb4gls7pf1uc-g-elamFFAhXziN9f4NJyeUAfe4BREmBhARx4LwQlTvJ9WIm1VGAQ6VaCnmJ3DuOV2IrINvEYL7pfRmNOrgJG4sCbp-S2dUa_6wXMCdfZYpuEYEAvDHzTg3Lu1fBlvlRx5mLkgA3wI_3rdrjWHA
  ```

3. 同時，env variable `AWS_CONTAINER_CREDENTIALS_FULL_URI` http://169.254.170.23/v1/credentials 這個定義。

> The EKS Pod Identity Agent uses the hostNetwork of the node and it uses port 80 and port 2703 on a link-local address on the node. This address is 169.254.170.23 for IPv4 and [fd00:ec2::23] for IPv6 clusters.
- Ref: [EKS Pod Identities](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html)

  ```
  ## 檢視 hostNetwork 跟 port
  $ kubectl -n kube-system get ds eks-pod-identity-agent -o yaml | less
  ```

4. 接續，因為 Pod 以 DaemonSet 方式部署在每一個節點上，登入至 Node 驗證。

  ```
  [ec2-user@ip-192-168-1-29 ~]$ sudo netstat -ntupl |grep ":80"
  tcp        0      0 169.254.170.23:80       0.0.0.0:*               LISTEN      3668/eks-pod-identi
  tcp6       0      0 fd00:ec2::23:80         :::*                    LISTEN      3668/eks-pod-identi

  [ec2-user@ip-192-168-1-29 ~]$ ip a
  1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
      link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
      inet 127.0.0.1/8 scope host lo
        valid_lft forever preferred_lft forever
      inet6 ::1/128 scope host
        valid_lft forever preferred_lft forever
  2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc mq state UP group default qlen 1000
      link/ether 0e:fc:2b:86:08:0f brd ff:ff:ff:ff:ff:ff
      inet 192.168.1.29/19 brd 192.168.31.255 scope global dynamic eth0
        valid_lft 2051sec preferred_lft 2051sec
      inet6 fe80::cfc:2bff:fe86:80f/64 scope link
        valid_lft forever preferred_lft forever
  3: dummy0: <BROADCAST,NOARP> mtu 1500 qdisc noop state DOWN group default qlen 1000
      link/ether 0a:e5:81:69:fd:ce brd ff:ff:ff:ff:ff:ff
  4: pod-id-link0: <BROADCAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN group default qlen 1000
      link/ether 72:d6:73:fb:73:c1 brd ff:ff:ff:ff:ff:ff
      inet 169.254.170.23/32 scope global pod-id-link0
        valid_lft forever preferred_lft forever
      inet6 fd00:ec2::23/128 scope global
        valid_lft forever preferred_lft forever
      inet6 fe80::70d6:73ff:fefb:73c1/64 scope link
        valid_lft forever preferred_lft forever
  ```

5. 嘗試使用 curl 命令發現需要填入 Service Account Token。

  ```
  [ec2-user@ip-192-168-1-29 ~]$ curl 169.254.170.23/v1/credentials
  Service account token cannot be empty
  ```

  將 TOKEN 填入，取得 AWS temporary credentials。

  ```
  [ec2-user@ip-192-168-1-29 ~]$ TOKEN="eyJh...drjWHA"

  [ec2-user@ip-192-168-1-29 ~]$ curl 169.254.170.23/v1/credentials -H "Authorization: $TOKEN" | jq .
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                  Dload  Upload   Total   Spent    Left  Speed
  100  1269  100  1269    0     0  11314      0 --:--:-- --:--:-- --:--:-- 11330
  {
    "AccessKeyId": "ASIAUU2VK5QEICHZO56K",
    "SecretAccessKey": "ybEA.....gvxde",
    "Token": "IQoJb3JpZ2luX2VjEBkaDmFwLW5vcnRoZWFzdC0xIkYwRAIgdyi4a7koHgSxVnY1MfCsQ098tP/...+vpxEM6VkLJjiVVZdVLlbrM5wH42J2ejv32yK7hbo5pCsxuKfd0RpADx5c/ANdpYG9KnJgn4Q4=",
    "AccountId": "319617166344",
    "Expiration": "2024-05-24T23:07:20Z"
  }

  [ec2-user@ip-192-168-1-29 ~]$ aws eks-auth assume-role-for-pod-identity --cluster-name demo --token $TOKEN
  {
      "subject": {
          "namespace": "default",
          "serviceAccount": "ec2-describer"
      },
      "audience": "pods.eks.amazonaws.com",
      "podIdentityAssociation": {
          "associationArn": "arn:aws:eks:ap-northeast-1:319617166344:podidentityassociation/demo/a-uplracrzgd8p4uz1u",
          "associationId": "a-uplracrzgd8p4uz1u"
      },
      "assumedRoleUser": {
          "arn": "arn:aws:sts::319617166344:assumed-role/eksctl-demo-podidentityrole-default-ec2-descr-Role1-9YWIdz5W09wm/eks-demo-aws-cli-87e3682b-b463-47d7-940e-35c3e22476b2",
          "assumeRoleId": "AROAUU2VK5QEPJCRS7HTA:eks-demo-aws-cli-87e3682b-b463-47d7-940e-35c3e22476b2"
      },
      "credentials": {
          "sessionToken": "IQoJb3JpZ2luX2VjEBkaDmFwLW5vcnRoZWFzdC0xIkcwRQIgLmP9o9X28bS5x/HHKc/97lGDUYFSXndbkJz64IXZD60CIQDhWLDieiTyzH9pe/kpMygZce70uYppgWpMgikZUg...
          ...
          ...
          +WwgmPnYX9HytS0B4cdYrcvor03tATJUd2BKTcO7vsUIuLjfu4z0DcDy91qfvnO6UhARV4q3NmoxHU3WFyGjPkrH35DksRNiXTur8CkvGz6qSOzLdpRT32W0CRWSX/XkdZ1kDwPD9ToGsvIfO8OTeoAWKpjqv0=",
          "secretAccessKey": "QZwK........3s3afD",
          "accessKeyId": "ASIAUU2VK5QEGCIEIMM2",
          "expiration": "2024-05-24T23:07:40+00:00"
      }
  }
  ```

6. AWS CLI SDK credential chain

  ```
  $ kubectl exec -it aws-cli -- aws sts get-caller-identity --debug
  ...
  2024-05-24 17:09:24,814 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: env
  2024-05-24 17:09:24,814 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: assume-role
  2024-05-24 17:09:24,814 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: assume-role-with-web-identity
  2024-05-24 17:09:24,814 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: sso
  2024-05-24 17:09:24,815 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: shared-credentials-file
  2024-05-24 17:09:24,815 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: custom-process
  2024-05-24 17:09:24,815 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: config-file
  2024-05-24 17:09:24,815 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: ec2-credentials-file
  2024-05-24 17:09:24,815 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: boto-config
  2024-05-24 17:09:24,815 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: container-role
  2024-05-24 17:09:24,816 - MainThread - urllib3.connectionpool - DEBUG - Starting new HTTP connection (1): 169.254.170.23:80
  2024-05-24 17:09:24,817 - MainThread - urllib3.connectionpool - DEBUG - http://169.254.170.23:80 "GET /v1/credentials HTTP/1.1" 200 1269
```

1. Cloud Watch Logs Insights syntax：

  ```
  filter @logStream like /^kube-apiserver-audit/
  | fields @timestamp, @message,
  | sort @timestamp desc
  | filter objectRef.name == 'aws-cli' AND verb == 'create'
  | filter userAgent like 'kubectl'
  | limit 10000
  ```
