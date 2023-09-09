# 建立 EKS 集群環境

1. 啟用 EC2 並選用最新版本 Amazon Linux 2 AMI（`Amazon Linux 2 Kernel 5.10 AMI`）作為控制 EKS 叢集主機，於此主機將會安裝 `kubectl`、AWS CLI 及 `eksctl` 等工具來進行管理 EKS 叢集。倘若有使用 AWS CLI 則可以透過以下 [Systems Manager parameters](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html) [1] 取得 EC2 AMI ID 名稱。

    ```bash
    $ aws ssm get-parameters --names /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2 --region eu-west-1 --query "Parameters[*]"
    [
      {
        "Name": "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2",
        "Type": "String",
        "Value": "ami-047aad752a426ed48",
        "Version": 86,
        "LastModifiedDate": "2023-05-11T23:00:08.701000+00:00",
        "ARN": "arn:aws:ssm:eu-west-1::parameter/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2",
        "DataType": "text"
      }
    ]
    ```

2. 安裝 [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) [2]。

    ```bash
    $ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
            Dload  Upload   Total   Spent    Left  Speed
    0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
    100 44.8M  100 44.8M    0     0  69.0M      0 --:--:-- --:--:-- --:--:-- 68.9M
    $ unzip awscliv2.zip
    $ sudo ./aws/install
    ```

3. 安裝 [`eksctl`](https://eksctl.io/introduction/#installation) [3] 命令。

    ```bash
    ARCH=amd64
    PLATFORM=$(uname -s)_$ARCH
    curl -sLO "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"
    tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz
    sudo mv /tmp/eksctl /usr/local/bin
    ```

4. `eksctl` 命令可建立最新 [Kubernetes 叢集版本為 1.27](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html) [4]，故安裝 [kubectl 1.27 版本](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/) [5]。

    ```bash
    $ curl -LO https://dl.k8s.io/release/v1.27.2/bin/linux/amd64/kubectl
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
              Dload  Upload   Total   Spent    Left  Speed
    100   138  100   138    0     0    885      0 --:--:-- --:--:-- --:--:--   890
    100 46.9M  100 46.9M    0     0  26.4M      0  0:00:01  0:00:01 --:--:-- 36.6M

    $ sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    ```

5. 設定 [AWS CLI 認證（credentials）](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files) [6]，eksctl 命令使用此 IAM 使用者（或角色）權限作為 EKS 叢集建立者。倘若希望 IAM 使用者（或角色）可以限制 IAM 最小執行權限，建議大家可以參考 [eksctl 最小 IAM policies 文件設置](https://eksctl.io/usage/minimum-iam-policies/) [7]。

  ```bash
  aws configure
  ```

6. 建立 `eksctl` `ClusterConfig` 文件（ [`ironman.yaml`](./ironman.yaml) ）[8]，並啟用控制平面記錄檔（control plane logs）。

    ```bash
    $ cat ironman.yaml
    apiVersion: eksctl.io/v1alpha5
    kind: ClusterConfig

    metadata:
    name: ironman
    version: "1.27"
    region: eu-west-1

    managedNodeGroups: # 建立受管理的 nodegroup，並設定節點數量為 2
    - name: "ng1-public-ssh"
      desiredCapacity: 2
      ssh: # 允許 SSH 訪問權限
      # Enable ssh access (via the admin container)
      allow: true
      publicKeyName: "demo"
      iam:
      withAddonPolicies:
        ebs: true
        fsx: true
        efs: true
        awsLoadBalancerController: true
        autoScaler: true

    iam: # 啟用 IAM OpenID Connect（OIDC）Provider
    withOIDC: true
    cloudWatch: # 啟用控制平面記錄檔（control plane logs）
    clusterLogging:
      enableTypes: ["*"]
    ```

7. 透過 `eksctl` 命令建立叢集。

    ```bash
    $ eksctl create cluster -f ./ironman.yaml
    2023-05-28 15:39:04 [ℹ]  eksctl version 0.143.0
    2023-05-28 15:39:04 [ℹ]  using region eu-west-1
    2023-05-28 15:39:04 [ℹ]  setting availability zones to [eu-west-1c eu-west-1b eu-west-1a]
    2023-05-28 15:39:04 [ℹ]  subnets for eu-west-1c - public:192.168.0.0/19 private:192.168.96.0/19
    2023-05-28 15:39:04 [ℹ]  subnets for eu-west-1b - public:192.168.32.0/19 private:192.168.128.0/19
    2023-05-28 15:39:04 [ℹ]  subnets for eu-west-1a - public:192.168.64.0/19 private:192.168.160.0/19
    2023-05-28 15:39:04 [ℹ]  nodegroup "ng1-public-ssh" will use "" [AmazonLinux2/1.27]
    2023-05-28 15:39:04 [ℹ]  using EC2 key pair "demo"
    2023-05-28 15:39:04 [ℹ]  using Kubernetes version 1.27
    2023-05-28 15:39:04 [ℹ]  creating EKS cluster "ironman" in "eu-west-1" region with managed nodes
    2023-05-28 15:39:04 [ℹ]  1 nodegroup (ng1-public-ssh) was included (based on the include/exclude rules)
    2023-05-28 15:39:04 [ℹ]  will create a CloudFormation stack for cluster itself and 0 nodegroup stack(s)
    2023-05-28 15:39:04 [ℹ]  will create a CloudFormation stack for cluster itself and 1 managed nodegroup stack(s)
    2023-05-28 15:39:04 [ℹ]  if you encounter any issues, check CloudFormation console or try 'eksctl utils describe-stacks --region=e
    u-west-1 --cluster=ironman'
    2023-05-28 15:39:04 [ℹ]  Kubernetes API endpoint access will use default of {publicAccess=true, privateAccess=false} for cluster "
    ironman" in "eu-west-1"
    2023-05-28 15:39:04 [ℹ]  configuring CloudWatch logging for cluster "ironman" in "eu-west-1" (enabled types: api, audit, authentic
    ator, controllerManager, scheduler & no types disabled)
    2023-05-28 15:39:04 [ℹ]
    2 sequential tasks: { create cluster control plane "ironman",
      2 sequential sub-tasks: {
        4 sequential sub-tasks: {
        wait for control plane to become ready,
        associate IAM OIDC provider,
        2 sequential sub-tasks: {
          create IAM role for serviceaccount "kube-system/aws-node",
          create serviceaccount "kube-system/aws-node",
        },
        restart daemonset "kube-system/aws-node",
        },
        create managed nodegroup "ng1-public-ssh",
      }
    }
    2023-05-28 15:39:04 [ℹ]  building cluster stack "eksctl-ironman-cluster"
    2023-05-28 15:39:04 [ℹ]  deploying stack "eksctl-ironman-cluster"
    2023-05-28 15:39:34 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-cluster"
    2023-05-28 15:40:04 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-cluster"
    ...
    ...
    ...
    2023-05-28 15:49:05 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-cluster"
    2023-05-28 15:51:06 [ℹ]  building iamserviceaccount stack "eksctl-ironman-addon-iamserviceaccount-kube-system-aws-node"
    2023-05-28 15:51:06 [ℹ]  deploying stack "eksctl-ironman-addon-iamserviceaccount-kube-system-aws-node"
    2023-05-28 15:51:06 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-kube-system-aws-node"
    2023-05-28 15:51:36 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-kube-system-aws-node"
    2023-05-28 15:51:36 [ℹ]  serviceaccount "kube-system/aws-node" already exists
    2023-05-28 15:51:36 [ℹ]  updated serviceaccount "kube-system/aws-node"
    2023-05-28 15:51:36 [ℹ]  daemonset "kube-system/aws-node" restarted
    2023-05-28 15:51:36 [ℹ]  building managed nodegroup stack "eksctl-ironman-nodegroup-ng1-public-ssh"
    2023-05-28 15:51:37 [ℹ]  deploying stack "eksctl-ironman-nodegroup-ng1-public-ssh"
    2023-05-28 15:51:37 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-ng1-public-ssh"
    2023-05-28 15:52:07 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-ng1-public-ssh"
    2023-05-28 15:53:06 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-ng1-public-ssh"
    2023-05-28 15:54:42 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-nodegroup-ng1-public-ssh"
    2023-05-28 15:54:42 [ℹ]  waiting for the control plane to become ready
    2023-05-28 15:54:42 [✔]  saved kubeconfig as "/home/ec2-user/.kube/config"
    2023-05-28 15:54:42 [ℹ]  no tasks
    2023-05-28 15:54:42 [✔]  all EKS cluster resources for "ironman" have been created
    2023-05-28 15:54:42 [ℹ]  nodegroup "ng1-public-ssh" has 2 node(s)
    2023-05-28 15:54:42 [ℹ]  node "ip-192-168-58-7.eu-west-1.compute.internal" is ready
    2023-05-28 15:54:42 [ℹ]  node "ip-192-168-9-109.eu-west-1.compute.internal" is ready
    2023-05-28 15:54:42 [ℹ]  waiting for at least 2 node(s) to become ready in "ng1-public-ssh"
    2023-05-28 15:54:42 [ℹ]  nodegroup "ng1-public-ssh" has 2 node(s)
    2023-05-28 15:54:42 [ℹ]  node "ip-192-168-58-7.eu-west-1.compute.internal" is ready
    2023-05-28 15:54:42 [ℹ]  node "ip-192-168-9-109.eu-west-1.compute.internal" is ready
    2023-05-28 15:54:44 [ℹ]  kubectl command should work with "/home/ec2-user/.kube/config", try 'kubectl get nodes'
    2023-05-28 15:39:04 [ℹ]  eksctl version 0.143.0
    ```

## 參考文件

1. Calling AMI public parameters - <https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html>
2. Installing or updating the latest version of the AWS CLI - <https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>
3. Introduction - eksctl - <https://eksctl.io/introduction/#installation>
4. Amazon EKS Kubernetes versions - <https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html>
5. Install and Set Up kubectl on Linux - <https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/>
6. Configuration and credential file settings - Set and view configuration settings using commands - <https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-methods>
7. Minimum IAM policies - eksctl - <https://eksctl.io/usage/minimum-iam-policies/>
8. Creating and managing clusters | Using Config Files - eksctl - <https://eksctl.io/usage/creating-and-managing-clusters/#using-config-files>
