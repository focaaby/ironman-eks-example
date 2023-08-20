# 建置環境

1. 透過官方 [Container Insights on Amazon EKS and Kubernetes 文件](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-EKS-quickstart.html#Container-Insights-setup-EKS-quickstart-Fluentd)[1]所提供的 Quick Start template 部署 CloudWatch agent 及 Fluentd。
```
$ curl https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/quickstart/cwagent-fluentd-quickstart.yaml | sed "s/{{cluster_name}}/ironman/;s/{{region_name}}/eu-west-1/" | kubectl apply -f -
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16515  100 16515    0     0  60210      0 --:--:-- --:--:-- --:--:-- 60054
namespace/amazon-cloudwatch created
serviceaccount/cloudwatch-agent created
clusterrole.rbac.authorization.k8s.io/cloudwatch-agent-role created
clusterrolebinding.rbac.authorization.k8s.io/cloudwatch-agent-role-binding created
configmap/cwagentconfig created
daemonset.apps/cloudwatch-agent created
configmap/cluster-info created
serviceaccount/fluentd created
clusterrole.rbac.authorization.k8s.io/fluentd-role created
clusterrolebinding.rbac.authorization.k8s.io/fluentd-role-binding created
configmap/fluentd-config created
daemonset.apps/fluentd-cloudwatch created
```
其原始碼 template 也可於 [GitHub - CloudWatch Agent for Container Insights Kubernetes Monitoring](https://github.com/aws-samples/amazon-cloudwatch-container-insights/tree/main/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring)[2] 查看。

2. 由於 CloudWatch agent 及 Fluentd 皆需要具有 CloudWatch Logs 或 Metrics IAM 權限，因此以下範例透過關聯 `CloudWatchAgentAdminPolicy` 方式設定 [IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) [3]。透過 `eksctl` 命令建立 IAM role 給與 ServiceAccount `fluentd` 及 `cloudwatch-agent`  使用。

```
$ eksctl create iamserviceaccount \
--cluster=ironman \
--namespace=amazon-cloudwatch \
--name=cloudwatch-agent \
--attach-policy-arn=arn:aws:iam::aws:policy/CloudWatchAgentAdminPolicy \
--override-existing-serviceaccounts \
--region eu-west-1 \
--approve
2023-08-15 03:19:24 [ℹ]  1 existing iamserviceaccount(s) (kube-system/aws-node) will be excluded
2023-08-15 03:19:24 [ℹ]  1 iamserviceaccount (amazon-cloudwatch/cloudwatch-agent) was included (based on the include/exclude rules)
2023-08-15 03:19:24 [!]  metadata of serviceaccounts that exist in Kubernetes will be updated, as --override-existing-serviceaccounts was set
2023-08-15 03:19:24 [ℹ]  1 task: {
    2 sequential sub-tasks: {
        create IAM role for serviceaccount "amazon-cloudwatch/cloudwatch-agent",
        create serviceaccount "amazon-cloudwatch/cloudwatch-agent",
    } }2023-08-15 03:19:24 [ℹ]  building iamserviceaccount stack "eksctl-ironman-addon-iamserviceaccount-amazon-cloudwatch-cloudwatch-agent"
2023-08-15 03:19:25 [ℹ]  deploying stack "eksctl-ironman-addon-iamserviceaccount-amazon-cloudwatch-cloudwatch-agent"
2023-08-15 03:19:25 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-amazon-cloudwatch-cloudwatch-agent"
2023-08-15 03:19:55 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-amazon-cloudwatch-cloudwatch-agent"
2023-08-15 03:19:55 [ℹ]  serviceaccount "amazon-cloudwatch/cloudwatch-agent" already exists
2023-08-15 03:19:55 [ℹ]  updated serviceaccount "amazon-cloudwatch/cloudwatch-agent"

$ eksctl create iamserviceaccount \
--cluster=ironman \
--namespace=amazon-cloudwatch \
--name=fluentd \
--attach-policy-arn=arn:aws:iam::aws:policy/CloudWatchAgentAdminPolicy \
--override-existing-serviceaccounts \
--region eu-west-1 \
--approve
2023-08-15 03:20:10 [ℹ]  2 existing iamserviceaccount(s) (amazon-cloudwatch/cloudwatch-agent,kube-system/aws-node) will be excluded
2023-08-15 03:20:10 [ℹ]  1 iamserviceaccount (amazon-cloudwatch/fluentd) was included (based on the include/exclude rules)
2023-08-15 03:20:10 [!]  metadata of serviceaccounts that exist in Kubernetes will be updated, as --override-existing-serviceaccounts was set
2023-08-15 03:20:10 [ℹ]  1 task: {
    2 sequential sub-tasks: {
        create IAM role for serviceaccount "amazon-cloudwatch/fluentd",
        create serviceaccount "amazon-cloudwatch/fluentd",
    } }2023-08-15 03:20:10 [ℹ]  building iamserviceaccount stack "eksctl-ironman-addon-iamserviceaccount-amazon-cloudwatch-fluentd"
2023-08-15 03:20:10 [ℹ]  deploying stack "eksctl-ironman-addon-iamserviceaccount-amazon-cloudwatch-fluentd"
2023-08-15 03:20:10 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-amazon-cloudwatch-fluentd"
2023-08-15 03:20:40 [ℹ]  waiting for CloudFormation stack "eksctl-ironman-addon-iamserviceaccount-amazon-cloudwatch-fluentd"
2023-08-15 03:20:41 [ℹ]  serviceaccount "amazon-cloudwatch/fluentd" already exists
2023-08-15 03:20:41 [ℹ]  updated serviceaccount "amazon-cloudwatch/fluentd"
```

3. 分別透過 `kubectl rollout` 重啟 DaemonSet `cloudwatch-agent` 及 `fluentd-cloudwatch`。
```
$ kubectl -n amazon-cloudwatch rollout restart ds cloudwatch-agent
daemonset.apps/cloudwatch-agent restarted

$ kubectl -n amazon-cloudwatch rollout restart ds fluentd-cloudwatch
daemonset.apps/fluentd-cloudwatch restarted
```

## CloudWatch Agent log

### Pod

```
{
    "AutoScalingGroupName": "eks-ng1-public-ssh-84c4f1ae-6190-b94a-46e3-29226086ee91",
    "CloudWatchMetrics": [
        {
            "Metrics": [
                {
                    "Unit": "Percent",
                    "Name": "pod_cpu_utilization"
                },
                {
                    "Unit": "Percent",
                    "Name": "pod_memory_utilization"
                },
                {
                    "Unit": "Bytes/Second",
                    "Name": "pod_network_rx_bytes"
                },
                {
                    "Unit": "Bytes/Second",
                    "Name": "pod_network_tx_bytes"
                }
            ],
            "Dimensions": [
                [
                    "PodName",
                    "Namespace",
                    "ClusterName"
                ],
                [
                    "Namespace",
                    "ClusterName"
                ],
                [
                    "ClusterName"
                ]
            ],
            "Namespace": "ContainerInsights"
        },
        {
            "Metrics": [
                {
                    "Unit": "Percent",
                    "Name": "pod_cpu_reserved_capacity"
                }
            ],
            "Dimensions": [
                [
                    "PodName",
                    "Namespace",
                    "ClusterName"
                ],
                [
                    "ClusterName"
                ]
            ],
            "Namespace": "ContainerInsights"
        },
        {
            "Metrics": [
                {
                    "Unit": "Count",
                    "Name": "pod_number_of_container_restarts"
                }
            ],
            "Dimensions": [
                [
                    "PodName",
                    "Namespace",
                    "ClusterName"
                ]
            ],
            "Namespace": "ContainerInsights"
        }
    ],
    "ClusterName": "ironman",
    "InstanceId": "i-0ea90c13bca800dc5",
    "InstanceType": "m5.large",
    "Namespace": "kube-system",
    "NodeName": "ip-192-168-34-221.eu-west-1.compute.internal",
    "PodName": "kube-proxy",
    "Sources": [
        "cadvisor",
        "pod",
        "calculated"
    ],
    "Timestamp": "1692070115141",
    "Type": "Pod",
    "Version": "0",
    "kubernetes": {
        "host": "ip-192-168-34-221.eu-west-1.compute.internal",
        "labels": {
            "controller-revision-hash": "7b695c689f",
            "k8s-app": "kube-proxy",
            "pod-template-generation": "1"
        },
        "namespace_name": "kube-system",
        "pod_id": "0eea15e4-07c3-4a5b-b56e-b287725d759c",
        "pod_name": "kube-proxy-njbhd",
        "pod_owners": [
            {
                "owner_kind": "DaemonSet",
                "owner_name": "kube-proxy"
            }
        ]
    },
    "pod_cpu_request": 100,
    "pod_cpu_reserved_capacity": 5,
    "pod_cpu_usage_system": 0.23521055177657407,
    "pod_cpu_usage_total": 0.18380335695927924,
    "pod_cpu_usage_user": 0,
    "pod_cpu_utilization": 0.009190167847963962,
    "pod_memory_cache": 0,
    "pod_memory_failcnt": 0,
    "pod_memory_hierarchical_pgfault": 0,
    "pod_memory_hierarchical_pgmajfault": 0,
    "pod_memory_mapped_file": 0,
    "pod_memory_max_usage": 13905920,
    "pod_memory_pgfault": 0,
    "pod_memory_pgmajfault": 0,
    "pod_memory_rss": 11218944,
    "pod_memory_swap": 0,
    "pod_memory_usage": 12132352,
    "pod_memory_utilization": 0.14977826546453007,
    "pod_memory_working_set": 12132352,
    "pod_network_rx_bytes": 11331.477275733067,
    "pod_network_rx_dropped": 0,
    "pod_network_rx_errors": 0,
    "pod_network_rx_packets": 26.42352915142902,
    "pod_network_total_bytes": 21954.524168482298,
    "pod_network_tx_bytes": 10623.04689274923,
    "pod_network_tx_dropped": 0,
    "pod_network_tx_errors": 0,
    "pod_network_tx_packets": 25.773285704749558,
    "pod_number_of_container_restarts": 0,
    "pod_number_of_containers": 1,
    "pod_number_of_running_containers": 1,
    "pod_status": "Running"
}
```

### Node
```
{
    "AutoScalingGroupName": "eks-ng1-public-ssh-84c4f1ae-6190-b94a-46e3-29226086ee91",
    "CloudWatchMetrics": [
        {
            "Metrics": [
                {
                    "Unit": "Percent",
                    "Name": "node_filesystem_utilization"
                }
            ],
            "Dimensions": [
                [
                    "NodeName",
                    "InstanceId",
                    "ClusterName"
                ],
                [
                    "ClusterName"
                ]
            ],
            "Namespace": "ContainerInsights"
        }
    ],
    "ClusterName": "ironman",
    "InstanceId": "i-0ea90c13bca800dc5",
    "InstanceType": "m5.large",
    "NodeName": "ip-192-168-34-221.eu-west-1.compute.internal",
    "Sources": [
        "cadvisor",
        "calculated"
    ],
    "Timestamp": "1692070064265",
    "Type": "NodeFS",
    "Version": "0",
    "device": "/dev/nvme0n1p1",
    "fstype": "vfs",
    "kubernetes": {
        "host": "ip-192-168-34-221.eu-west-1.compute.internal"
    },
    "node_filesystem_available": 82350014464,
    "node_filesystem_capacity": 85886742528,
    "node_filesystem_inodes": 41942000,
    "node_filesystem_inodes_free": 41880493,
    "node_filesystem_usage": 3536728064,
    "node_filesystem_utilization": 4.117897547280931
}
```


## 參考文件

1. Quick Start setup for Container Insights on Amazon EKS and Kubernetes - Quick Start with the CloudWatch agent and Fluentd - https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-EKS-quickstart.html#Container-Insights-setup-EKS-quickstart-Fluentd
2. CloudWatch Agent for Container Insights Kubernetes Monitoring - https://github.com/aws-samples/amazon-cloudwatch-container-insights/tree/master/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring
3. IAM roles for service accounts - https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html
4. Verify prerequisites - https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-prerequisites.html
