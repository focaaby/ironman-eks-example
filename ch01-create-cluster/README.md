

#  建立 EKS 集群環境

## 版本

- Kubernetes: `1.27`
- EKS platform: `eks.1`
  ```
  $ aws eks describe-cluster --name ironman --query cluster.[version,platformVersion]
  [
      "1.27",
      "eks.1"
  ]
  ```
- `kubectl`: `v1.27.2`
  ```
  $ kubectl version -o yaml
  clientVersion:
    buildDate: "2023-05-17T14:20:07Z"
    compiler: gc
    gitCommit: 7f6f68fdabc4df88cfea2dcf9a19b2b830f1e647
    gitTreeState: clean
    gitVersion: v1.27.2
    goVersion: go1.20.4
    major: "1"
    minor: "27"
    platform: linux/amd64
  kustomizeVersion: v5.0.1
  serverVersion:
    buildDate: "2023-04-14T20:40:28Z"
    compiler: gc
    gitCommit: abfec7d7e55d56346a5259c9379dea9f56ba2926
    gitTreeState: clean
    gitVersion: v1.27.1-eks-2f008fe
    goVersion: go1.20.3
    major: "1"
    minor: 27+
    platform: linux/amd64
  ```
- `eksctl`: `0.143.0`
  ```
  $ eksctl version
  0.143.0
  ```
- AWS CLI: `aws-cli/2.11.21 Python/3.11.3 Linux/5.10.179-166.674.amzn2.x86_64 exe/x86_64.amzn.2 prompt/off`
  ```
  $ aws --version
  aws-cli/2.11.21 Python/3.11.3 Linux/5.10.179-166.674.amzn2.x86_64 exe/x86_64.amzn.2 prompt/off
  ```

## 步驟

1. 啟用 EC2 並選用最新版本 Amazon Linux 2 AMI（`Amazon Linux 2 Kernel 5.10 AMI`）作為控制 EKS 集群主機，於此主機將會安裝 `kubectl`、AWS CLI 及 `eksctl` 等工具來進行管理 EKS 集群。倘若有使用 AWS CLI 則可以透過以下 Systems Manager parameters 取得 EC2 AMI ID 名稱[1]。
  ```
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
2. 安裝 AWS CLI[2]。
  ```
  $ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                  Dload  Upload   Total   Spent    Left  Speed
    0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  100 44.8M  100 44.8M    0     0  69.0M      0 --:--:-- --:--:-- --:--:-- 68.9M

  $ unzip awscliv2.zip

  $ sudo ./aws/install

  $ aws --version
  aws-cli/2.11.21 Python/3.11.3 Linux/5.10.179-166.674.amzn2.x86_64 exe/x86_64.amzn.2 prompt/off
  ```
3. 安裝 `eksctl` [3] 命令。
  ```
  $ ARCH=amd64
  $ PLATFORM=$(uname -s)_$ARCH
  $ curl -sLO "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"
  $ tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz
  $ sudo mv /tmp/eksctl /usr/local/bin
  $ eksctl version
  0.143.0
  ```
4. `eksctl` 命令可建立最新 Kubernetes 集群版本為 1.27 [4]，故安裝 kubectl 1.27 版本[5]。
  ```
  $ curl -LO https://dl.k8s.io/release/v1.27.2/bin/linux/amd64/kubectl
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                  Dload  Upload   Total   Spent    Left  Speed
  100   138  100   138    0     0    885      0 --:--:-- --:--:-- --:--:--   890
  100 46.9M  100 46.9M    0     0  26.4M      0  0:00:01  0:00:01 --:--:-- 36.6M

  $ sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  ```
5. 設定 AWS CLI 認證（credentials）[6]，eksctl 命令使用此 IAM 使用者（或角色）權限作為 EKS 集群建立者[3]。倘若希望 IAM 使用者（或角色）可以限制 IAM 最小執行權限，建議大家可以參考 eksctl 最小 IAM policies 文件設置[7]。
  ```
  $ aws configure
  ```
6. 建立 `eksctl` `ClusterConfig`文件（[`ironman.yaml`](./ironman.yaml)），並啟用控制平面記錄檔（control plane logs）[12]。
  ```
  $ cat ironman.yaml
  apiVersion: eksctl.io/v1alpha5
  kind: ClusterConfig

  metadata:
    name: ironman
    version: "1.27"
    region: eu-west-1

  managedNodeGroups:
    - name: "ng1-public-ssh"
      desiredCapacity: 2
      ssh:
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

  iam:
    withOIDC: true
  cloudWatch:
    clusterLogging:
      enableTypes: ["*"]
  ```
7. 透過 `eksctl` 命令建立集群。
  ```
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
  2023-05-28 15:54:44 [✔]  EKS cluster "ironman" in "eu-west-1" region is ready
  ```

## 參考文件

1. Calling AMI public parameters - https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-public-parameters-ami.html
2. Installing or updating the latest version of the AWS CLI - https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
3. Introduction - eksctl - https://eksctl.io/introduction/#installation
4. Amazon EKS Kubernetes versions - https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html
5. Install and Set Up kubectl on Linux - https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
6. Configuration and credential file settings - Set and view configuration settings using commands - https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html#cli-configure-files-methods
7. Minimum IAM policies - eksctl - https://eksctl.io/usage/minimum-iam-policies/
8. Creating and managing clusters | Using Config Files - eksctl - https://eksctl.io/usage/creating-and-managing-clusters/#using-config-files
