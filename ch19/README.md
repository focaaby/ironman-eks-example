# 建置環境

1. 建立以下 `nginx-nlb-service-demo.yaml` YAML。使用 Nginx 作為 server-side 應用程式。

    ```bash
    $ cat ./nginx-nlb-service-demo.yaml
    apiVersion: v1
    kind: Namespace
    metadata:
      name: "nginx-demo"
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: "nginx-demo-deployment"
      namespace: "nginx-demo"
    spec:
      selector:
        matchLabels:
          app: "nginx-demo"
      replicas: 3
      template:
        metadata:
          labels:
            app: "nginx-demo"
            role: "backend"
        spec:
          containers:
          - image: nginx:latest
            imagePullPolicy: Always
            name: "nginx-demo"
            ports:
            - containerPort: 80
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: "service-nginx-demo"
      namespace: "nginx-demo"
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: nlb
        service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    spec:
      type: LoadBalancer
      ports:
        - port: 80
          targetPort: 80
          protocol: TCP
      selector:
        app: "nginx-demo"
    ```

2. 建立以下 `netshoot.yaml` 文件作為 client。

    ```bash
    $ cat ./netshoot.yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: netshoot
    spec:
      containers:
      - name: netshoot
        image: nicolaka/netshoot:latest
        command:
          - sleep
          - infinity
        imagePullPolicy: IfNotPresent
      restartPolicy: Alway
    ```

3. 部署 `Deployment`，這邊以 Nginx server 作為 server-side。

    ```bash
    $ kubectl apply -f ./nginx-nlb-service-demo.yaml
    namespace/nginx-demo created
    deployment.apps/nginx-demo-deployment created
    service/service-nginx-demo created
    ```

4. 部署 Pod `netshoot`。

    ```bash
    $ kubectl apply -f ./netshoot.yaml
    pod/netshoot created
    ```

5. 檢視節點、pod、service object。

    ```bash
    $ kubectl get node
    NAME                                           STATUS   ROLES    AGE    VERSION
    ip-192-168-18-190.eu-west-1.compute.internal   Ready    <none>   21h    v1.27.3-eks-a5565ad
    ip-192-168-55-245.eu-west-1.compute.internal   Ready    <none>   22h    v1.27.3-eks-a5565ad
    ip-192-168-61-79.eu-west-1.compute.internal    Ready    <none>   133m   v1.27.3-eks-a5565ad
    ip-192-168-71-85.eu-west-1.compute.internal    Ready    <none>   133m   v1.27.3-eks-a5565ad
    ip-192-168-76-241.eu-west-1.compute.internal   Ready    <none>   133m   v1.27.1-eks-2f008fe
    ```

    ```bash
    $ kubectl get po -o wide
    NAME       READY   STATUS    RESTARTS   AGE   IP              NODE                                           NOMINATED NODE   READINESS GATES
    netshoot   1/1     Running   0          36s   192.168.41.36   ip-192-168-55-245.eu-west-1.compute.internal   <none>           <none>

    $ kubectl -n nginx-demo get svc,pod -o wide
    NAME                         TYPE           CLUSTER-IP       EXTERNAL-IP                                                                     PORT(S)        AGE   SELECTOR
    service/service-nginx-demo   LoadBalancer   10.100.135.233   a0ac38093315243b1a67d275a4379ca6-c09bd862a6e56fc5.elb.eu-west-1.amazonaws.com   80:30161/TCP   36s   app=nginx-demo

    NAME                                         READY   STATUS    RESTARTS   AGE   IP               NODE                                           NOMINATED NODE   READINESS GATES
    pod/nginx-demo-deployment-7489d44bbd-9z5dg   1/1     Running   0          36s   192.168.21.160   ip-192-168-18-190.eu-west-1.compute.internal   <none>           <none>
    pod/nginx-demo-deployment-7489d44bbd-jcshp   1/1     Running   0          36s   192.168.44.248   ip-192-168-61-79.eu-west-1.compute.internal    <none>           <none>
    pod/nginx-demo-deployment-7489d44bbd-m22pd   1/1     Running   0          36s   192.168.73.88    ip-192-168-76-241.eu-west-1.compute.internal   <none>           <none>
    ```

5. 透過 Pod `netshoot`  使用 `curl` 命令訪問 NLB endpoint。

    ```bash
    $ kubectl exec -it netshoot -- curl a0ac38093315243b1a67d275a4379ca6-c09bd862a6e56fc5.elb.eu-west-1.amazonaws.com
    <!DOCTYPE html>
    <html>
    <head>
    <title>Welcome to nginx!</title>
    <style>
    html { color-scheme: light dark; }
    body { width: 35em; margin: 0 auto;
    font-family: Tahoma, Verdana, Arial, sans-serif; }
    </style>
    </head>
    <body>
    <h1>Welcome to nginx!</h1>
    <p>If you see this page, the nginx web server is successfully installed and
    working. Further configuration is required.</p>

    <p>For online documentation and support please refer to
    <a href="http://nginx.org/">nginx.org</a>.<br/>
    Commercial support is available at
    <a href="http://nginx.com/">nginx.com</a>.</p>

    <p><em>Thank you for using nginx.</em></p>
    </body>
    </html>

    $ kubectl exec -it netshoot -- curl a0ac38093315243b1a67d275a4379ca6-c09bd862a6e56fc5.elb.eu-west-1.amazonaws.com
    ## 偶發性 timeout 而沒有回應
    ```
