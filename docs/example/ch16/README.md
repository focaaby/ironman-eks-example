# Ch16 實驗輸出內容

## CNI API

```bash
[ec2-user@ip-192-168-34-221 ~]$ curl -s http://localhost:61679/v1/enis | jq .
{
  "TotalIPs": 5,
  "AssignedIPs": 2,
  "ENIs": {
    "eni-06177dab35fe3b175": {
      "ID": "eni-06177dab35fe3b175",
      "IsPrimary": true,
      "IsTrunk": false,
      "IsEFA": false,
      "DeviceNumber": 0,
      "AvailableIPv4Cidrs": {
        "192.168.41.206/32": {
          "Cidr": {
            "IP": "192.168.41.206",
            "Mask": "/////w=="
          },
          "IPAddresses": {
            "192.168.41.206": {
              "Address": "192.168.41.206",
              "IPAMKey": {
                "networkName": "",
                "containerID": "",
                "ifName": ""
              },
              "IPAMMetadata": {},
              "AssignedTime": "2023-08-18T06:28:44.591961428Z",
              "UnassignedTime": "2023-08-18T06:29:21.270910136Z"
            }
          },
          "IsPrefix": false,
          "AddressFamily": ""
        },
        "192.168.61.89/32": {
          "Cidr": {
            "IP": "192.168.61.89",
            "Mask": "/////w=="
          },
          "IPAddresses": {
            "192.168.61.89": {
              "Address": "192.168.61.89",
              "IPAMKey": {
                "networkName": "aws-cni",
                "containerID": "bc7edad7edc5fd053cd8b3dec995f9aca6a54ba56b790f0d5e94f00d8bbc3f15",
                "ifName": "eth0"
              },
              "IPAMMetadata": {
                "k8sPodNamespace": "default",
                "k8sPodName": "netshoot"
              },
              "AssignedTime": "2023-08-17T06:18:52.626402867Z",
              "UnassignedTime": "0001-01-01T00:00:00Z"
            }
          },
          "IsPrefix": false,
          "AddressFamily": ""
        }
      },
      "IPv6Cidrs": {}
    },
    "eni-0c8a3ec18c7e743fa": {
      "ID": "eni-0c8a3ec18c7e743fa",
      "IsPrimary": false,
      "IsTrunk": false,
      "IsEFA": false,
      "DeviceNumber": 1,
      "AvailableIPv4Cidrs": {
        "192.168.36.45/32": {
          "Cidr": {
            "IP": "192.168.36.45",
            "Mask": "/////w=="
          },
          "IPAddresses": {},
          "IsPrefix": false,
          "AddressFamily": ""
        },
        "192.168.47.38/32": {
          "Cidr": {
            "IP": "192.168.47.38",
            "Mask": "/////w=="
          },
          "IPAddresses": {
            "192.168.47.38": {
              "Address": "192.168.47.38",
              "IPAMKey": {
                "networkName": "aws-cni",
                "containerID": "22106f6e9bb6292847e7a853c03e9c36b8bd7c632caacff8e1874bc844a18900",
                "ifName": "eth0"
              },
              "IPAMMetadata": {
                "k8sPodNamespace": "kube-system",
                "k8sPodName": "coredns-66984db76b-26fmj"
              },
              "AssignedTime": "2023-08-18T06:29:20.481087185Z",
              "UnassignedTime": "0001-01-01T00:00:00Z"
            }
          },
          "IsPrefix": false,
          "AddressFamily": ""
        },
        "192.168.58.151/32": {
          "Cidr": {
            "IP": "192.168.58.151",
            "Mask": "/////w=="
          },
          "IPAddresses": {},
          "IsPrefix": false,
          "AddressFamily": ""
        }
      },
      "IPv6Cidrs": {}
    }
  }
}
```
