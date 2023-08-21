# 建置環境

1. 在此使用 Docker Hub [networkstatic/iperf3](https://hub.docker.com/r/networkstatic/iperf3)[1] 預先安裝好 [`iperf3`](https://iperf.fr/iperf-download.php)[2] 命令的 image。 以下建置 iperf server-side：
```
$ cat ./iperf3-demo.yaml
apiVersion: v1
kind: Namespace
metadata:
    name: iperf3
---
apiVersion: v1
kind: Pod
metadata:
  name: iperf3-client
  namespace: iperf3
spec:
  nodeSelector:
    kubernetes.io/hostname: ip-192-168-34-221.eu-west-1.compute.internal
  containers:
  - name: iperf3
    image: networkstatic/iperf3
    command:
      - sleep
      - infinity
    imagePullPolicy: IfNotPresent
  restartPolicy: Always
---
apiVersion: v1
kind: Pod
metadata:
  name: iperf3-server
  namespace: iperf3
spec:
  nodeSelector:
    kubernetes.io/hostname: ip-192-168-34-221.eu-west-1.compute.internal
  containers:
  - name: iperf3
    image: networkstatic/iperf3
    command:
      - sleep
      - infinity
    imagePullPolicy: IfNotPresent
  restartPolicy: Always
```

2. 使用 image `networkstatic/iperf3` 部署 server-side 及 client-side。
```
$ kubectl apply -f ./iperf3-demo.yaml
namespace/iperf3 created
pod/iperf3-client created
pod/iperf3-server created
```

1. 檢視 pod 啟用於相同的節點上，instance id：`i-0ea90c13bca800dc5`。
```
$ kubectl -n iperf3 get po -o wide
NAME            READY   STATUS    RESTARTS   AGE     IP               NODE                                                NOMINATED NODE   READINESS GATES
iperf3-client   1/1     Running   0          5m27s   192.168.45.50    ip-192-168-34-221.eu-west-1.compute.internal   <none>           <none>
iperf3-server   1/1     Running   0          5m27s   192.168.60.100   ip-192-168-34-221.eu-west-1.compute.internal   <none>           <none>

$ kubectl get no ip-192-168-34-221.eu-west-1.compute.internal -o jsonpath='{.spec.providerID}'
aws:///eu-west-1d/i-0ea90c13bca800dc5
```
4. 使用 iperf3 命令作為 server side。
```
$ kubectl -n iperf3 exec -it iperf3-server -- iperf3 -s -f K
-----------------------------------------------------------
Server listening on 5201
-----------------------------------------------------------
```
4. 使用 iperf3 command 作為 client side 並指定 server IP `192.168.60.100`。

```
$ kubectl -n iperf3 exec -it iperf3-client -- iperf3 -c 192.168.60.100 -f K
Connecting to host 192.168.60.100, port 5201
[  5] local 192.168.45.50 port 56366 connected to 192.168.60.100 port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  2.18 GBytes  2283426 KBytes/sec   38   7.83 MBytes
[  5]   1.00-2.00   sec  2.24 GBytes  2344667 KBytes/sec    0   7.83 MBytes
[  5]   2.00-3.00   sec  2.08 GBytes  2182638 KBytes/sec    1   7.83 MBytes
[  5]   3.00-4.00   sec  2.37 GBytes  2482263 KBytes/sec    0   7.83 MBytes
[  5]   4.00-5.00   sec  2.50 GBytes  2622203 KBytes/sec    0   7.83 MBytes
[  5]   5.00-6.00   sec  2.47 GBytes  2595117 KBytes/sec    0   7.83 MBytes
[  5]   6.00-7.00   sec  2.50 GBytes  2617752 KBytes/sec   43   7.83 MBytes
[  5]   7.00-8.00   sec  2.34 GBytes  2455213 KBytes/sec    0   7.83 MBytes
[  5]   8.00-9.00   sec  2.46 GBytes  2579915 KBytes/sec    0   7.83 MBytes
[  5]   9.00-10.00  sec  2.28 GBytes  2390320 KBytes/sec    0   7.83 MBytes
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  23.4 GBytes  2455351 KBytes/sec   82             sender
[  5]   0.00-10.01  sec  23.4 GBytes  2452227 KBytes/sec                  receiver

iperf Done.

## Server side 開始接收

-----------------------------------------------------------
Accepted connection from 192.168.45.50, port 56360
[  5] local 192.168.60.100 port 5201 connected to 192.168.45.50 port 56366
[ ID] Interval           Transfer     Bitrate
[  5]   0.00-1.00   sec  2.15 GBytes  2252355 KBytes/sec
[  5]   1.00-2.00   sec  2.24 GBytes  2348417 KBytes/sec
[  5]   2.00-3.00   sec  2.09 GBytes  2186234 KBytes/sec
[  5]   3.00-4.00   sec  2.36 GBytes  2479985 KBytes/sec
[  5]   4.00-5.00   sec  2.50 GBytes  2622093 KBytes/sec
[  5]   5.00-6.00   sec  2.47 GBytes  2595488 KBytes/sec
[  5]   6.00-7.00   sec  2.49 GBytes  2614656 KBytes/sec
[  5]   7.00-8.00   sec  2.34 GBytes  2452075 KBytes/sec
[  5]   8.00-9.00   sec  2.47 GBytes  2588849 KBytes/sec
[  5]   9.00-10.00  sec  2.28 GBytes  2386232 KBytes/sec
[  5]  10.00-10.01  sec  23.6 MBytes  2124341 KBytes/sec
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate
[  5]   0.00-10.01  sec  23.4 GBytes  2452227 KBytes/sec                  receiver
-----------------------------------------------------------
Server listening on 5201
-----------------------------------------------------------
```

## 參考文件

1. https://hub.docker.com/r/networkstatic/iperf3
2. iPerf - The ultimate speed test tool for TCP, UDP and SCTP - https://iperf.fr/iperf-download.php
