
## 1.27 kubelet systemd unit config
```
[ec2-user@ip-192-168-30-190 ~]$ systemctl cat kubelet
# /etc/systemd/system/kubelet.service
[Unit]
Description=Kubernetes Kubelet
Documentation=https://github.com/kubernetes/kubernetes
After=containerd.service sandbox-image.service
Requires=containerd.service sandbox-image.service

[Service]
Slice=runtime.slice
ExecStartPre=/sbin/iptables -P FORWARD ACCEPT -w 5
ExecStart=/usr/bin/kubelet \
    --config /etc/kubernetes/kubelet/kubelet-config.json \
    --kubeconfig /var/lib/kubelet/kubeconfig \
    --container-runtime-endpoint unix:///run/containerd/containerd.sock \
    --image-credential-provider-config /etc/eks/image-credential-provider/config.json \
    --image-credential-provider-bin-dir /etc/eks/image-credential-provider \
    $KUBELET_ARGS \
    $KUBELET_EXTRA_ARGS

Restart=on-failure
RestartForceExitStatus=SIGPIPE
RestartSec=5
KillMode=process
CPUAccounting=true
MemoryAccounting=true

[Install]
WantedBy=multi-user.target

# /etc/systemd/system/kubelet.service.d/10-kubelet-args.conf
[Service]
Environment='KUBELET_ARGS=--node-ip=192.168.30.190 --pod-infra-container-image=602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/pause:3.5 --v=2
# /etc/systemd/system/kubelet.service.d/30-kubelet-extra-args.conf
[Service]
Environment='KUBELET_EXTRA_ARGS=--node-labels=eks.amazonaws.com/sourceLaunchTemplateVersion=1,alpha.eksctl.io/cluster-name=ironman,alpha.eksctl
```
## containerd config
 
```
[ec2-user@ip-192-168-30-190 ~]$ cat /etc/containerd/config.toml
version = 2
root = "/var/lib/containerd"
state = "/run/containerd"

[grpc]
address = "/run/containerd/containerd.sock"

[plugins."io.containerd.grpc.v1.cri".containerd]
default_runtime_name = "runc"

[plugins."io.containerd.grpc.v1.cri"]
sandbox_image = "602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/pause:3.5"

[plugins."io.containerd.grpc.v1.cri".registry]
config_path = "/etc/containerd/certs.d:/etc/docker/certs.d"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
runtime_type = "io.containerd.runc.v2"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
SystemdCgroup = true

[plugins."io.containerd.grpc.v1.cri".cni]
bin_dir = "/opt/cni/bin"
conf_dir = "/etc/cni/net.d"
```
