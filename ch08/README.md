# 更新 VPC CNI plugin 為 EKS add-on 管理

1. 使用 `aws eks describe-addon-versions` 命令來檢視 EKS 當前 Kubernetes 版本及 Amazon VPC CNI plugin add-on 的相容性及預設版本：

    ```bash
    $ aws eks describe-addon-versions --kubernetes-version 1.27 --addon-name vpc-cni \
    --query 'addons[].addonVersions[].{Version: addonVersion, Defaultversion: compatibilities[0].defaultVersion}' --output table
    ------------------------------------------
    |          DescribeAddonVersions         |
    +-----------------+----------------------+
    | Defaultversion  |       Version        |
    +-----------------+----------------------+
    |  False          |  v1.13.2-eksbuild.1  |
    |  False          |  v1.13.0-eksbuild.1  |
    |  True           |  v1.12.6-eksbuild.2  |
    |  False          |  v1.12.6-eksbuild.1  |
    |  False          |  v1.12.5-eksbuild.2  |
    +-----------------+----------------------+
    ```

2. 檢視當前 EKS 使用預設使用 Amazon VPC CNI plugin 版本。我們使用的 EKS 叢集是 Kubernetes 1.27 版本，預設版本為 `v1.12.6-eksbuild.2`，最新版本為 `v1.13.2-eksbuild.1`。

    ```bash
    $ kubectl describe daemonset aws-node --namespace kube-system | grep Image | cut -d "/" -f 2
    amazon-k8s-cni-init:v1.12.6-eksbuild.2
    amazon-k8s-cni:v1.12.6-eksbuild.2
    ```

3. EKS 安裝 VPC CNI plugin 時，已經預設好 [IRSA（IAM roles for service accounts）](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) [1] 並關聯 IAM policy [AmazonEKS_CNI_Policy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKS_CNI_Policy.html) [2] 允許 VPC CNI plugin 可以協助管理 AWS ENI 資源。稍後再建立 EKS add-on 時，可以重複利用相同的 IAM role 而無需重新建立一個新的 IAM role。

    查看 Service Account `aws-node` 所使用關聯的 IRSA 使用的 IAM role arn。

    ```bash
    $ kubectl -n kube-system get sa aws-node -o json | jq -r '.metadata.annotations."eks.amazonaws.com/role-arn"'
    arn:aws:iam::111111111111:role/eksctl-ironman-addon-iamserviceaccount-kube-Role1-158LYHBTRF5GB
    ```

4. 使用 `eksctl create addon` 命令更新 VPC CNI plugin 至 `v1.13.2-eksbuild.1` 並綁定對應 Service Account IAM role ARN。

    ```bash
    $ eksctl create addon --name vpc-cni --version v1.13.2-eksbuild.1 --service-account-role-arn="arn:aws:iam::111111111111:role/eksctl-ironman-addon-iamserviceaccount-kube-Role1-158LYHBTRF5GB" --cluster=ironman
    2023-07-03 09:50:22 [ℹ]  Kubernetes version "1.27" in use by cluster "ironman"
    2023-07-03 09:50:23 [ℹ]  when creating an addon to replace an existing application, e.g. CoreDNS, kube-proxy & VPC-CNI the --force flag will ensure the currently deployed configuration is replaced
    2023-07-03 09:50:23 [ℹ]  using provided ServiceAccountRoleARN "arn:aws:iam::111111111111:role/eksctl-ironman-addon-iamserviceaccount-kube-Role1-158LYHBTRF5GB"
    2023-07-03 09:50:23 [ℹ]  creating addon
    Error: addon status transitioned to "CREATE_FAILED"
    ```

5. 由上述錯誤資訊，可以觀察到 add-on 建立失敗產生了 `CREATE_FAILED` 錯誤訊息。這時候，我們繼續嘗試使用 `--force` 參數強制更新。

    ```bash
    $ eksctl create addon --name vpc-cni --version v1.13.2-eksbuild.1 --service-account-role-arn="arn:aws:iam::111111111111:role/eksctl-ironman-addon-iamserviceaccount-kube-Role1-158LYHBTRF5GB" --cluster=ironman --force
    2023-07-03 09:51:57 [ℹ]  Kubernetes version "1.27" in use by cluster "ironman"
    2023-07-03 09:51:58 [ℹ]  using provided ServiceAccountRoleARN "arn:aws:iam::111111111111:role/eksctl-ironman-addon-iamserviceaccount-kube-Role1-158LYHBTRF5GB"
    2023-07-03 09:51:58 [ℹ]  creating addon
    2023-07-03 09:53:32 [ℹ]  addon "vpc-cni" active
    ```

6. 確認 VPC CNI plugin 成功更新至 `v1.13.2-eksbuild.1` 版本。

    ```bash
    $ kubectl describe daemonset aws-node --namespace kube-system | grep Image | cut -d "/" -f 2
    amazon-k8s-cni:v1.13.2-eksbuild.1
    amazon-k8s-cni-init:v1.13.2-eksbuild.1
    ```

## 參考文件

1. IAM roles for service accounts - <https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html>
2. AmazonEKS_CNI_Policy - <https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonEKS_CNI_Policy.html>
