## cloud-init config

```
$ aws cloudformation get-template --stack-name eksctl-ironman-nodegroup-demo-self-ng --query TemplateBody.Resources.NodeGroupLaunchTemplate.Properties.LaunchTemplateData.UserData --output text | base64 -d | gunzip
#cloud-config
packages: null
runcmd:
- - /var/lib/cloud/scripts/eksctl/bootstrap.al2.sh
- - /var/lib/cloud/scripts/eksctl/bootstrap.helper.sh
write_files:
- content: '{}'
  owner: root:root
  path: /etc/eksctl/kubelet-extra.json
  permissions: "0644"
- content: |-
    B64_CLUSTER_CA=LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMvakNDQWVhZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRJek1EVXlPREUxTkRVd04xb1hEVE16TURVeU5URTFORFV3TjFvd0ZURVRNQkVHQTFV...Cg==
    NODE_LABELS=alpha.eksctl.io/cluster-name=ironman,alpha.eksctl.io/nodegroup-name=demo-self-ng
    NODE_TAINTS=
    CLUSTER_DNS=10.100.0.10
    CONTAINER_RUNTIME=containerd
    CLUSTER_NAME=ironman
    API_SERVER_URL=https://AD53C9886D8810A31F464FF34383460C.gr7.eu-west-1.eks.amazonaws.com
  owner: root:root
  path: /etc/eksctl/kubelet.env
  permissions: "0644"
- content: |
    #!/bin/bash

    set -o errexit
    set -o pipefail
    set -o nounset

    source /var/lib/cloud/scripts/eksctl/bootstrap.helper.sh

    echo "eksctl: running /etc/eks/bootstrap"
    /etc/eks/bootstrap.sh "${CLUSTER_NAME}" \
      --apiserver-endpoint "${API_SERVER_URL}" \
      --b64-cluster-ca "${B64_CLUSTER_CA}" \
      --dns-cluster-ip "${CLUSTER_DNS}" \
      --kubelet-extra-args "${KUBELET_EXTRA_ARGS}" \
      --container-runtime "${CONTAINER_RUNTIME}" \
      ${ENABLE_LOCAL_OUTPOST:+--enable-local-outpost "${ENABLE_LOCAL_OUTPOST}"} \
      ${CLUSTER_ID:+--cluster-id "${CLUSTER_ID}"}

    echo "eksctl: merging user options into kubelet-config.json"
    trap 'rm -f ${TMP_KUBE_CONF}' EXIT
    jq -s '.[0] * .[1]' "${KUBELET_CONFIG}" "${KUBELET_EXTRA_CONFIG}" > "${TMP_KUBE_CONF}"
    mv "${TMP_KUBE_CONF}" "${KUBELET_CONFIG}"

    systemctl daemon-reload
    echo "eksctl: restarting kubelet-eks"
    systemctl restart kubelet
    echo "eksctl: done"
  owner: root:root
  path: /var/lib/cloud/scripts/eksctl/bootstrap.al2.sh
  permissions: "0755"
- content: |
    #!/bin/bash

    set -o errexit
    set -o pipefail
    set -o nounset

    source /etc/eksctl/kubelet.env # file written by bootstrapper

    # Use IMDSv2 to get metadata
    TOKEN="$(curl --silent -X PUT -H "X-aws-ec2-metadata-token-ttl-seconds: 600" http://169.254.169.254/latest/api/token)"
    function get_metadata() {
      curl --silent -H "X-aws-ec2-metadata-token: $TOKEN" "http://169.254.169.254/latest/meta-data/$1"
    }

    API_SERVER_URL="${API_SERVER_URL}"
    B64_CLUSTER_CA="${B64_CLUSTER_CA}"
    INSTANCE_ID="$(get_metadata instance-id)"
    INSTANCE_LIFECYCLE="$(get_metadata instance-life-cycle)"
    CLUSTER_DNS="${CLUSTER_DNS:-}"
    NODE_TAINTS="${NODE_TAINTS:-}"
    MAX_PODS="${MAX_PODS:-}"
    NODE_LABELS="${NODE_LABELS},node-lifecycle=${INSTANCE_LIFECYCLE},alpha.eksctl.io/instance-id=${INSTANCE_ID}"

    KUBELET_ARGS=("--node-labels=${NODE_LABELS}")
    [[ -n "${NODE_TAINTS}" ]] && KUBELET_ARGS+=("--register-with-taints=${NODE_TAINTS}")
    # --max-pods as a CLI argument is deprecated, this is a workaround until we deprecate support for maxPodsPerNode
    [[ -n "${MAX_PODS}" ]] && KUBELET_ARGS+=("--max-pods=${MAX_PODS}")
    KUBELET_EXTRA_ARGS="${KUBELET_ARGS[@]}"

    CLUSTER_NAME="${CLUSTER_NAME}"
    KUBELET_CONFIG='/etc/kubernetes/kubelet/kubelet-config.json'
    KUBELET_EXTRA_CONFIG='/etc/eksctl/kubelet-extra.json'
    TMP_KUBE_CONF='/tmp/kubelet-conf.json'
    CONTAINER_RUNTIME="${CONTAINER_RUNTIME:-dockerd}" # default for al2 just in case, not used in ubuntu
  owner: root:root
  path: /var/lib/cloud/scripts/eksctl/bootstrap.helper.sh
  permissions: "0755"
```
