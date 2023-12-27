# Ch5 Audit log

```json
[
  {
    "@message": {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "level": "RequestResponse",
      "auditID": "132d1635-7b3b-4768-a62f-46eeb9e22a54",
      "stage": "ResponseComplete",
      "requestURI": "/apis/certificates.k8s.io/v1/certificatesigningrequests",
      "verb": "create",
      "user": {
        "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
        "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
        "groups": [
          "system:bootstrappers",
          "system:nodes",
          "system:authenticated"
        ],
        "extra": {
          "accessKeyId": [
            "ASIA5V3NJ2SQ5JHQAAGB"
          ],
          "arn": [
            "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
          ],
          "canonicalArn": [
            "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
          ],
          "principalId": [
            "AROA5V3NJ2SQYVJIV4AKV"
          ],
          "sessionName": [
            "i-0e6c1f51d6dd34b3f"
          ]
        }
      },
      "sourceIPs": [
        "13.231.41.13"
      ],
      "userAgent": "kubelet/v1.27.3 (linux/amd64) kubernetes/78c8293",
      "objectRef": {
        "resource": "certificatesigningrequests",
        "apiGroup": "certificates.k8s.io",
        "apiVersion": "v1"
      },
      "responseStatus": {
        "metadata": {},
        "code": 201
      },
      "requestObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "generateName": "csr-",
          "creationTimestamp": null
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQmJqQ0NBUlFDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBVDVrNVlzVG5US01PRFgKa3lsRmN3dmlwTEwrdXY5cUhsSGV5eDNhNCtReDArTU5BZlFqYzhyTXhHcW9FbDkrbERSVzIrL2oxK0U2UHZOcAo1TStTd0R0Rm9GUXdVZ1lKS29aSWh2Y05BUWtPTVVVd1F6QkJCZ05WSFJFRU9qQTRnakJwY0MweE9USXRNVFk0CkxUY3dMVGMwTG1Gd0xXNXZjblJvWldGemRDMHhMbU52YlhCMWRHVXVhVzUwWlhKdVlXeUhCTUNvUmtvd0NnWUkKS29aSXpqMEVBd0lEU0FBd1JRSWdZMUhCaWluMnpPR3cxS3BVVlNyMnJyQ1hnRFRPRW93R3dlVDVjZ2pFODdFQwpJUUNiUWQ5RVJjV29qOEZIdmNsSmkyNjVwcE82MmU5K0h4bGJvdEYxOU9FY3BnPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUgUkVRVUVTVC0tLS0tCg==",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ]
        },
        "status": {}
      },
      "responseObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6plsz",
          "generateName": "csr-",
          "uid": "cc14b5bb-3cf3-4e19-8545-63889029316d",
          "resourceVersion": "1771273",
          "creationTimestamp": "2023-08-19T13:30:53Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:30:53Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQmJqQ0NBUlFDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBVDVrNVlzVG5US01PRFgKa3lsRmN3dmlwTEwrdXY5cUhsSGV5eDNhNCtReDArTU5BZlFqYzhyTXhHcW9FbDkrbERSVzIrL2oxK0U2UHZOcAo1TStTd0R0Rm9GUXdVZ1lKS29aSWh2Y05BUWtPTVVVd1F6QkJCZ05WSFJFRU9qQTRnakJwY0MweE9USXRNVFk0CkxUY3dMVGMwTG1Gd0xXNXZjblJvWldGemRDMHhMbU52YlhCMWRHVXVhVzUwWlhKdVlXeUhCTUNvUmtvd0NnWUkKS29aSXpqMEVBd0lEU0FBd1JRSWdZMUhCaWluMnpPR3cxS3BVVlNyMnJyQ1hnRFRPRW93R3dlVDVjZ2pFODdFQwpJUUNiUWQ5RVJjV29qOEZIdmNsSmkyNjVwcE82MmU5K0h4bGJvdEYxOU9FY3BnPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUgUkVRVUVTVC0tLS0tCg==",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {}
      },
      "requestReceivedTimestamp": "2023-08-19T13:30:53.957200Z",
      "stageTimestamp": "2023-08-19T13:30:53.973385Z",
      "annotations": {
        "authorization.k8s.io/decision": "allow",
        "authorization.k8s.io/reason": ""
      }
    }
  },
  {
    "@message": {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "level": "RequestResponse",
      "auditID": "5a05ab7c-54b1-4ccb-a0b4-9e60ee97ca7b",
      "stage": "ResponseComplete",
      "requestURI": "/apis/certificates.k8s.io/v1/certificatesigningrequests/csr-6plsz/approval",
      "verb": "update",
      "user": {
        "username": "eks:certificate-controller",
        "groups": [
          "system:authenticated"
        ]
      },
      "sourceIPs": [
        "10.0.113.236"
      ],
      "userAgent": "eks-certificates-controller/v0.0.0 (linux/amd64) kubernetes/$Format",
      "objectRef": {
        "resource": "certificatesigningrequests",
        "name": "csr-6plsz",
        "uid": "cc14b5bb-3cf3-4e19-8545-63889029316d",
        "apiGroup": "certificates.k8s.io",
        "apiVersion": "v1",
        "resourceVersion": "1771273",
        "subresource": "approval"
      },
      "responseStatus": {
        "metadata": {},
        "code": 200
      },
      "requestObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6plsz",
          "generateName": "csr-",
          "uid": "cc14b5bb-3cf3-4e19-8545-63889029316d",
          "resourceVersion": "1771273",
          "creationTimestamp": "2023-08-19T13:30:53Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:30:53Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQmJqQ0NBUlFDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBVDVrNVlzVG5US01PRFgKa3lsRmN3dmlwTEwrdXY5cUhsSGV5eDNhNCtReDArTU5BZlFqYzhyTXhHcW9FbDkrbERSVzIrL2oxK0U2UHZOcAo1TStTd0R0Rm9GUXdVZ1lKS29aSWh2Y05BUWtPTVVVd1F6QkJCZ05WSFJFRU9qQTRnakJwY0MweE9USXRNVFk0CkxUY3dMVGMwTG1Gd0xXNXZjblJvWldGemRDMHhMbU52YlhCMWRHVXVhVzUwWlhKdVlXeUhCTUNvUmtvd0NnWUkKS29aSXpqMEVBd0lEU0FBd1JRSWdZMUhCaWluMnpPR3cxS3BVVlNyMnJyQ1hnRFRPRW93R3dlVDVjZ2pFODdFQwpJUUNiUWQ5RVJjV29qOEZIdmNsSmkyNjVwcE82MmU5K0h4bGJvdEYxOU9FY3BnPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUgUkVRVUVTVC0tLS0tCg==",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {
          "conditions": [
            {
              "type": "Approved",
              "status": "True",
              "reason": "AutoApproved",
              "message": "Auto approving self kubelet server certificate after SubjectAccessReview.",
              "lastUpdateTime": null,
              "lastTransitionTime": null
            }
          ]
        }
      },
      "responseObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6plsz",
          "generateName": "csr-",
          "uid": "cc14b5bb-3cf3-4e19-8545-63889029316d",
          "resourceVersion": "1771330",
          "creationTimestamp": "2023-08-19T13:30:53Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:30:53Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            },
            {
              "manager": "eks-certificates-controller",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:09Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:status": {
                  "f:conditions": {
                    ".": {},
                    "k:{\"type\":\"Approved\"}": {
                      ".": {},
                      "f:lastTransitionTime": {},
                      "f:lastUpdateTime": {},
                      "f:message": {},
                      "f:reason": {},
                      "f:status": {},
                      "f:type": {}
                    }
                  }
                }
              },
              "subresource": "approval"
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQmJqQ0NBUlFDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBVDVrNVlzVG5US01PRFgKa3lsRmN3dmlwTEwrdXY5cUhsSGV5eDNhNCtReDArTU5BZlFqYzhyTXhHcW9FbDkrbERSVzIrL2oxK0U2UHZOcAo1TStTd0R0Rm9GUXdVZ1lKS29aSWh2Y05BUWtPTVVVd1F6QkJCZ05WSFJFRU9qQTRnakJwY0MweE9USXRNVFk0CkxUY3dMVGMwTG1Gd0xXNXZjblJvWldGemRDMHhMbU52YlhCMWRHVXVhVzUwWlhKdVlXeUhCTUNvUmtvd0NnWUkKS29aSXpqMEVBd0lEU0FBd1JRSWdZMUhCaWluMnpPR3cxS3BVVlNyMnJyQ1hnRFRPRW93R3dlVDVjZ2pFODdFQwpJUUNiUWQ5RVJjV29qOEZIdmNsSmkyNjVwcE82MmU5K0h4bGJvdEYxOU9FY3BnPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUgUkVRVUVTVC0tLS0tCg==",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {
          "conditions": [
            {
              "type": "Approved",
              "status": "True",
              "reason": "AutoApproved",
              "message": "Auto approving self kubelet server certificate after SubjectAccessReview.",
              "lastUpdateTime": "2023-08-19T13:31:09Z",
              "lastTransitionTime": "2023-08-19T13:31:09Z"
            }
          ]
        }
      },
      "requestReceivedTimestamp": "2023-08-19T13:31:09.235032Z",
      "stageTimestamp": "2023-08-19T13:31:09.244772Z",
      "annotations": {
        "authorization.k8s.io/decision": "allow",
        "authorization.k8s.io/reason": "RBAC: allowed by ClusterRoleBinding \"eks:certificate-controller\" of ClusterRole \"system:controller:certificate-controller\" to User \"eks:certificate-controller\""
      }
    }
  },
  {
    "@message": {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "level": "RequestResponse",
      "auditID": "5ea3f787-3903-442a-89f6-00cf58eb6c8d",
      "stage": "ResponseComplete",
      "requestURI": "/apis/certificates.k8s.io/v1/certificatesigningrequests/csr-6plsz/status",
      "verb": "update",
      "user": {
        "username": "eks:certificate-controller",
        "groups": [
          "system:authenticated"
        ]
      },
      "sourceIPs": [
        "10.0.113.236"
      ],
      "userAgent": "eks-certificates-controller/v0.0.0 (linux/amd64) kubernetes/$Format",
      "objectRef": {
        "resource": "certificatesigningrequests",
        "name": "csr-6plsz",
        "uid": "cc14b5bb-3cf3-4e19-8545-63889029316d",
        "apiGroup": "certificates.k8s.io",
        "apiVersion": "v1",
        "resourceVersion": "1771330",
        "subresource": "status"
      },
      "responseStatus": {
        "metadata": {},
        "code": 200
      },
      "requestObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6plsz",
          "generateName": "csr-",
          "uid": "cc14b5bb-3cf3-4e19-8545-63889029316d",
          "resourceVersion": "1771330",
          "creationTimestamp": "2023-08-19T13:30:53Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:30:53Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            },
            {
              "manager": "eks-certificates-controller",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:09Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:status": {
                  "f:conditions": {
                    ".": {},
                    "k:{\"type\":\"Approved\"}": {
                      ".": {},
                      "f:lastTransitionTime": {},
                      "f:lastUpdateTime": {},
                      "f:message": {},
                      "f:reason": {},
                      "f:status": {},
                      "f:type": {}
                    }
                  }
                }
              },
              "subresource": "approval"
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQmJqQ0NBUlFDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBVDVrNVlzVG5US01PRFgKa3lsRmN3dmlwTEwrdXY5cUhsSGV5eDNhNCtReDArTU5BZlFqYzhyTXhHcW9FbDkrbERSVzIrL2oxK0U2UHZOcAo1TStTd0R0Rm9GUXdVZ1lKS29aSWh2Y05BUWtPTVVVd1F6QkJCZ05WSFJFRU9qQTRnakJwY0MweE9USXRNVFk0CkxUY3dMVGMwTG1Gd0xXNXZjblJvWldGemRDMHhMbU52YlhCMWRHVXVhVzUwWlhKdVlXeUhCTUNvUmtvd0NnWUkKS29aSXpqMEVBd0lEU0FBd1JRSWdZMUhCaWluMnpPR3cxS3BVVlNyMnJyQ1hnRFRPRW93R3dlVDVjZ2pFODdFQwpJUUNiUWQ5RVJjV29qOEZIdmNsSmkyNjVwcE82MmU5K0h4bGJvdEYxOU9FY3BnPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUgUkVRVUVTVC0tLS0tCg==",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {
          "conditions": [
            {
              "type": "Approved",
              "status": "True",
              "reason": "AutoApproved",
              "message": "Auto approving self kubelet server certificate after SubjectAccessReview.",
              "lastUpdateTime": "2023-08-19T13:31:09Z",
              "lastTransitionTime": "2023-08-19T13:31:09Z"
            }
          ],
          "certificate": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM4RENDQWRpZ0F3SUJBZ0lVR2t4L2FsaGxGTTVBYWsrNDR4SUhSSGU0VG44d0RRWUpLb1pJaHZjTkFRRUwKQlFBd0ZURVRNQkVHQTFVRUF4TUthM1ZpWlhKdVpYUmxjekFlRncweU16QTRNVGt4TXpJMk1EQmFGdzB5TkRBNApNVGd4TXpJMk1EQmFNRjR4RlRBVEJnTlZCQW9UREhONWMzUmxiVHB1YjJSbGN6RkZNRU1HQTFVRUF4TThjM2x6CmRHVnRPbTV2WkdVNmFYQXRNVGt5TFRFMk9DMDNNQzAzTkM1aGNDMXViM0owYUdWaGMzUXRNUzVqYjIxd2RYUmwKTG1sdWRHVnlibUZzTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFK1pPV0xFNTB5akRnMTVNcApSWE1MNHFTeS9yci9haDVSM3NzZDJ1UGtNZFBqRFFIMEkzUEt6TVJxcUJKZmZwUTBWdHZ2NDlmaE9qN3phZVRQCmtzQTdSYU9CdVRDQnRqQU9CZ05WSFE4QkFmOEVCQU1DQjRBd0V3WURWUjBsQkF3d0NnWUlLd1lCQlFVSEF3RXcKREFZRFZSMFRBUUgvQkFJd0FEQWRCZ05WSFE0RUZnUVVFSGlEUFdVSlNXTXpEMU8zVGtZVVhDb3E2dTR3SHdZRApWUjBqQkJnd0ZvQVVVNHhsTVdzWVpTUnBqQVUrREc1M2ZlNlZMK1l3UVFZRFZSMFJCRG93T0lJd2FYQXRNVGt5CkxURTJPQzAzTUMwM05DNWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1sdWRHVnlibUZzaHdUQXFFWksKTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFCeS9wYkdyTEh1WS9Rd1BtSEdmRzM0QXJ5VkdsR25mUU9sRW53WQppNkREZkFqRVJqeldtVURGbFI3Y25CRVk5SUJMcTNPSGNqN1dXTzlDQmJQTTVhMCtBVEhkRG4rYklyVkYxNUVxCm9wRHBiaS9Xcm1TbXRwZmt1QXpEQlZpUmJFeWlWb3lpeG1MZzlGOS8rTHdMV215MzZxR0ZXTGRwV2wvU2RHNDIKYy9OaVgxNDBySWx4RkxoZnZSL1hXTDlvalhIbFFqbFlGVitRVTJnbWdjNTIzaDZkTUZtd3dnOVkveWdsd2t3YQozNHRlZ0JpWmU2MERWMXlUL3lubUlYUGZLZWRsaThxMnZQeDNnbHE3NHA4bE1TVGFNT2xNUUhIL3E4TkxtWnRDClZaeE1WUStmUW94a1ZQUVdwMkNKbnd5TnhJc2NNaTBRa3dLMmJ2OHpSNndhaHkvVAotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=="
        }
      },
      "responseObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6plsz",
          "generateName": "csr-",
          "uid": "cc14b5bb-3cf3-4e19-8545-63889029316d",
          "resourceVersion": "1771331",
          "creationTimestamp": "2023-08-19T13:30:53Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:30:53Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            },
            {
              "manager": "eks-certificates-controller",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:09Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:status": {
                  "f:conditions": {
                    ".": {},
                    "k:{\"type\":\"Approved\"}": {
                      ".": {},
                      "f:lastTransitionTime": {},
                      "f:lastUpdateTime": {},
                      "f:message": {},
                      "f:reason": {},
                      "f:status": {},
                      "f:type": {}
                    }
                  }
                }
              },
              "subresource": "approval"
            },
            {
              "manager": "eks-certificates-controller",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:09Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:status": {
                  "f:certificate": {}
                }
              },
              "subresource": "status"
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQmJqQ0NBUlFDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBVDVrNVlzVG5US01PRFgKa3lsRmN3dmlwTEwrdXY5cUhsSGV5eDNhNCtReDArTU5BZlFqYzhyTXhHcW9FbDkrbERSVzIrL2oxK0U2UHZOcAo1TStTd0R0Rm9GUXdVZ1lKS29aSWh2Y05BUWtPTVVVd1F6QkJCZ05WSFJFRU9qQTRnakJwY0MweE9USXRNVFk0CkxUY3dMVGMwTG1Gd0xXNXZjblJvWldGemRDMHhMbU52YlhCMWRHVXVhVzUwWlhKdVlXeUhCTUNvUmtvd0NnWUkKS29aSXpqMEVBd0lEU0FBd1JRSWdZMUhCaWluMnpPR3cxS3BVVlNyMnJyQ1hnRFRPRW93R3dlVDVjZ2pFODdFQwpJUUNiUWQ5RVJjV29qOEZIdmNsSmkyNjVwcE82MmU5K0h4bGJvdEYxOU9FY3BnPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUgUkVRVUVTVC0tLS0tCg==",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {
          "conditions": [
            {
              "type": "Approved",
              "status": "True",
              "reason": "AutoApproved",
              "message": "Auto approving self kubelet server certificate after SubjectAccessReview.",
              "lastUpdateTime": "2023-08-19T13:31:09Z",
              "lastTransitionTime": "2023-08-19T13:31:09Z"
            }
          ],
          "certificate": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM4RENDQWRpZ0F3SUJBZ0lVR2t4L2FsaGxGTTVBYWsrNDR4SUhSSGU0VG44d0RRWUpLb1pJaHZjTkFRRUwKQlFBd0ZURVRNQkVHQTFVRUF4TUthM1ZpWlhKdVpYUmxjekFlRncweU16QTRNVGt4TXpJMk1EQmFGdzB5TkRBNApNVGd4TXpJMk1EQmFNRjR4RlRBVEJnTlZCQW9UREhONWMzUmxiVHB1YjJSbGN6RkZNRU1HQTFVRUF4TThjM2x6CmRHVnRPbTV2WkdVNmFYQXRNVGt5TFRFMk9DMDNNQzAzTkM1aGNDMXViM0owYUdWaGMzUXRNUzVqYjIxd2RYUmwKTG1sdWRHVnlibUZzTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFK1pPV0xFNTB5akRnMTVNcApSWE1MNHFTeS9yci9haDVSM3NzZDJ1UGtNZFBqRFFIMEkzUEt6TVJxcUJKZmZwUTBWdHZ2NDlmaE9qN3phZVRQCmtzQTdSYU9CdVRDQnRqQU9CZ05WSFE4QkFmOEVCQU1DQjRBd0V3WURWUjBsQkF3d0NnWUlLd1lCQlFVSEF3RXcKREFZRFZSMFRBUUgvQkFJd0FEQWRCZ05WSFE0RUZnUVVFSGlEUFdVSlNXTXpEMU8zVGtZVVhDb3E2dTR3SHdZRApWUjBqQkJnd0ZvQVVVNHhsTVdzWVpTUnBqQVUrREc1M2ZlNlZMK1l3UVFZRFZSMFJCRG93T0lJd2FYQXRNVGt5CkxURTJPQzAzTUMwM05DNWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1sdWRHVnlibUZzaHdUQXFFWksKTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFCeS9wYkdyTEh1WS9Rd1BtSEdmRzM0QXJ5VkdsR25mUU9sRW53WQppNkREZkFqRVJqeldtVURGbFI3Y25CRVk5SUJMcTNPSGNqN1dXTzlDQmJQTTVhMCtBVEhkRG4rYklyVkYxNUVxCm9wRHBiaS9Xcm1TbXRwZmt1QXpEQlZpUmJFeWlWb3lpeG1MZzlGOS8rTHdMV215MzZxR0ZXTGRwV2wvU2RHNDIKYy9OaVgxNDBySWx4RkxoZnZSL1hXTDlvalhIbFFqbFlGVitRVTJnbWdjNTIzaDZkTUZtd3dnOVkveWdsd2t3YQozNHRlZ0JpWmU2MERWMXlUL3lubUlYUGZLZWRsaThxMnZQeDNnbHE3NHA4bE1TVGFNT2xNUUhIL3E4TkxtWnRDClZaeE1WUStmUW94a1ZQUVdwMkNKbnd5TnhJc2NNaTBRa3dLMmJ2OHpSNndhaHkvVAotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=="
        }
      },
      "requestReceivedTimestamp": "2023-08-19T13:31:09.248891Z",
      "stageTimestamp": "2023-08-19T13:31:09.257417Z",
      "annotations": {
        "authorization.k8s.io/decision": "allow",
        "authorization.k8s.io/reason": "RBAC: allowed by ClusterRoleBinding \"eks:certificate-controller\" of ClusterRole \"system:controller:certificate-controller\" to User \"eks:certificate-controller\""
      }
    }
  },
  {
    "@message": {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "level": "RequestResponse",
      "auditID": "e60176ca-7047-4d26-96e0-0ee5919413dd",
      "stage": "ResponseComplete",
      "requestURI": "/apis/certificates.k8s.io/v1/certificatesigningrequests",
      "verb": "create",
      "user": {
        "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
        "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
        "groups": [
          "system:bootstrappers",
          "system:nodes",
          "system:authenticated"
        ],
        "extra": {
          "accessKeyId": [
            "ASIA5V3NJ2SQ5JHQAAGB"
          ],
          "arn": [
            "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
          ],
          "canonicalArn": [
            "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
          ],
          "principalId": [
            "AROA5V3NJ2SQYVJIV4AKV"
          ],
          "sessionName": [
            "i-0e6c1f51d6dd34b3f"
          ]
        }
      },
      "sourceIPs": [
        "13.231.41.13"
      ],
      "userAgent": "kubelet/v1.27.3 (linux/amd64) kubernetes/78c8293",
      "objectRef": {
        "resource": "certificatesigningrequests",
        "apiGroup": "certificates.k8s.io",
        "apiVersion": "v1"
      },
      "responseStatus": {
        "metadata": {},
        "code": 201
      },
      "requestObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "generateName": "csr-",
          "creationTimestamp": null
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQnJ6Q0NBVlVDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBU3g0Uk45NHN5UkQxSDIKMVlqU01GZnBxeEk1aUdkWWRZbnRIZ1JBVjIxVzYraXlaTkZ4NDNKNlNvS2kzcER2TmdlVFk5eHh2RDBIelowbQpodjJJdkJyOG9JR1VNSUdSQmdrcWhraUc5dzBCQ1E0eGdZTXdnWUF3ZmdZRFZSMFJCSGN3ZFlJMVpXTXlMVEV6CkxUSXpNUzAwTVMweE15NWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1GdFlYcHZibUYzY3k1amIyMkMKTUdsd0xURTVNaTB4TmpndE56QXROelF1WVhBdGJtOXlkR2hsWVhOMExURXVZMjl0Y0hWMFpTNXBiblJsY201aApiSWNFRGVjcERZY0V3S2hHU2pBS0JnZ3Foa2pPUFFRREFnTklBREJGQWlBdDcyMTZxaVpFYTd5VWt6eWk4aXQvCjEvc1hvckF2SG1PbUdXcit4OC9sdVFJaEFQU1RIMlZHZFBtS0xBYVhSdjFTdkRwY29TVGszQk1vbWpQdmZtRTUKQ21WTAotLS0tLUVORCBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0K",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ]
        },
        "status": {}
      },
      "responseObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6qtvv",
          "generateName": "csr-",
          "uid": "3ef319f8-0aa0-4997-8d74-4b3e348871b5",
          "resourceVersion": "1771334",
          "creationTimestamp": "2023-08-19T13:31:10Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:10Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQnJ6Q0NBVlVDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBU3g0Uk45NHN5UkQxSDIKMVlqU01GZnBxeEk1aUdkWWRZbnRIZ1JBVjIxVzYraXlaTkZ4NDNKNlNvS2kzcER2TmdlVFk5eHh2RDBIelowbQpodjJJdkJyOG9JR1VNSUdSQmdrcWhraUc5dzBCQ1E0eGdZTXdnWUF3ZmdZRFZSMFJCSGN3ZFlJMVpXTXlMVEV6CkxUSXpNUzAwTVMweE15NWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1GdFlYcHZibUYzY3k1amIyMkMKTUdsd0xURTVNaTB4TmpndE56QXROelF1WVhBdGJtOXlkR2hsWVhOMExURXVZMjl0Y0hWMFpTNXBiblJsY201aApiSWNFRGVjcERZY0V3S2hHU2pBS0JnZ3Foa2pPUFFRREFnTklBREJGQWlBdDcyMTZxaVpFYTd5VWt6eWk4aXQvCjEvc1hvckF2SG1PbUdXcit4OC9sdVFJaEFQU1RIMlZHZFBtS0xBYVhSdjFTdkRwY29TVGszQk1vbWpQdmZtRTUKQ21WTAotLS0tLUVORCBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0K",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {}
      },
      "requestReceivedTimestamp": "2023-08-19T13:31:10.260669Z",
      "stageTimestamp": "2023-08-19T13:31:10.266008Z",
      "annotations": {
        "authorization.k8s.io/decision": "allow",
        "authorization.k8s.io/reason": ""
      }
    }
  },
  {
    "@message": {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "level": "RequestResponse",
      "auditID": "4f53d53d-2443-4c94-a800-6f50e3855092",
      "stage": "ResponseComplete",
      "requestURI": "/apis/certificates.k8s.io/v1/certificatesigningrequests/csr-6qtvv/approval",
      "verb": "update",
      "user": {
        "username": "eks:certificate-controller",
        "groups": [
          "system:authenticated"
        ]
      },
      "sourceIPs": [
        "10.0.113.236"
      ],
      "userAgent": "eks-certificates-controller/v0.0.0 (linux/amd64) kubernetes/$Format",
      "objectRef": {
        "resource": "certificatesigningrequests",
        "name": "csr-6qtvv",
        "uid": "3ef319f8-0aa0-4997-8d74-4b3e348871b5",
        "apiGroup": "certificates.k8s.io",
        "apiVersion": "v1",
        "resourceVersion": "1771334",
        "subresource": "approval"
      },
      "responseStatus": {
        "metadata": {},
        "code": 200
      },
      "requestObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6qtvv",
          "generateName": "csr-",
          "uid": "3ef319f8-0aa0-4997-8d74-4b3e348871b5",
          "resourceVersion": "1771334",
          "creationTimestamp": "2023-08-19T13:31:10Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:10Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQnJ6Q0NBVlVDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBU3g0Uk45NHN5UkQxSDIKMVlqU01GZnBxeEk1aUdkWWRZbnRIZ1JBVjIxVzYraXlaTkZ4NDNKNlNvS2kzcER2TmdlVFk5eHh2RDBIelowbQpodjJJdkJyOG9JR1VNSUdSQmdrcWhraUc5dzBCQ1E0eGdZTXdnWUF3ZmdZRFZSMFJCSGN3ZFlJMVpXTXlMVEV6CkxUSXpNUzAwTVMweE15NWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1GdFlYcHZibUYzY3k1amIyMkMKTUdsd0xURTVNaTB4TmpndE56QXROelF1WVhBdGJtOXlkR2hsWVhOMExURXVZMjl0Y0hWMFpTNXBiblJsY201aApiSWNFRGVjcERZY0V3S2hHU2pBS0JnZ3Foa2pPUFFRREFnTklBREJGQWlBdDcyMTZxaVpFYTd5VWt6eWk4aXQvCjEvc1hvckF2SG1PbUdXcit4OC9sdVFJaEFQU1RIMlZHZFBtS0xBYVhSdjFTdkRwY29TVGszQk1vbWpQdmZtRTUKQ21WTAotLS0tLUVORCBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0K",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {
          "conditions": [
            {
              "type": "Approved",
              "status": "True",
              "reason": "AutoApproved",
              "message": "Auto approving self kubelet server certificate after SubjectAccessReview.",
              "lastUpdateTime": null,
              "lastTransitionTime": null
            }
          ]
        }
      },
      "responseObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6qtvv",
          "generateName": "csr-",
          "uid": "3ef319f8-0aa0-4997-8d74-4b3e348871b5",
          "resourceVersion": "1771386",
          "creationTimestamp": "2023-08-19T13:31:10Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:10Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            },
            {
              "manager": "eks-certificates-controller",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:25Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:status": {
                  "f:conditions": {
                    ".": {},
                    "k:{\"type\":\"Approved\"}": {
                      ".": {},
                      "f:lastTransitionTime": {},
                      "f:lastUpdateTime": {},
                      "f:message": {},
                      "f:reason": {},
                      "f:status": {},
                      "f:type": {}
                    }
                  }
                }
              },
              "subresource": "approval"
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQnJ6Q0NBVlVDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBU3g0Uk45NHN5UkQxSDIKMVlqU01GZnBxeEk1aUdkWWRZbnRIZ1JBVjIxVzYraXlaTkZ4NDNKNlNvS2kzcER2TmdlVFk5eHh2RDBIelowbQpodjJJdkJyOG9JR1VNSUdSQmdrcWhraUc5dzBCQ1E0eGdZTXdnWUF3ZmdZRFZSMFJCSGN3ZFlJMVpXTXlMVEV6CkxUSXpNUzAwTVMweE15NWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1GdFlYcHZibUYzY3k1amIyMkMKTUdsd0xURTVNaTB4TmpndE56QXROelF1WVhBdGJtOXlkR2hsWVhOMExURXVZMjl0Y0hWMFpTNXBiblJsY201aApiSWNFRGVjcERZY0V3S2hHU2pBS0JnZ3Foa2pPUFFRREFnTklBREJGQWlBdDcyMTZxaVpFYTd5VWt6eWk4aXQvCjEvc1hvckF2SG1PbUdXcit4OC9sdVFJaEFQU1RIMlZHZFBtS0xBYVhSdjFTdkRwY29TVGszQk1vbWpQdmZtRTUKQ21WTAotLS0tLUVORCBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0K",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {
          "conditions": [
            {
              "type": "Approved",
              "status": "True",
              "reason": "AutoApproved",
              "message": "Auto approving self kubelet server certificate after SubjectAccessReview.",
              "lastUpdateTime": "2023-08-19T13:31:25Z",
              "lastTransitionTime": "2023-08-19T13:31:25Z"
            }
          ]
        }
      },
      "requestReceivedTimestamp": "2023-08-19T13:31:25.422820Z",
      "stageTimestamp": "2023-08-19T13:31:25.440353Z",
      "annotations": {
        "authorization.k8s.io/decision": "allow",
        "authorization.k8s.io/reason": "RBAC: allowed by ClusterRoleBinding \"eks:certificate-controller\" of ClusterRole \"system:controller:certificate-controller\" to User \"eks:certificate-controller\""
      }
    }
  },
  {
    "@message": {
      "kind": "Event",
      "apiVersion": "audit.k8s.io/v1",
      "level": "RequestResponse",
      "auditID": "b1bcc155-5332-4b11-b151-2be338422a38",
      "stage": "ResponseComplete",
      "requestURI": "/apis/certificates.k8s.io/v1/certificatesigningrequests/csr-6qtvv/status",
      "verb": "update",
      "user": {
        "username": "eks:certificate-controller",
        "groups": [
          "system:authenticated"
        ]
      },
      "sourceIPs": [
        "10.0.113.236"
      ],
      "userAgent": "eks-certificates-controller/v0.0.0 (linux/amd64) kubernetes/$Format",
      "objectRef": {
        "resource": "certificatesigningrequests",
        "name": "csr-6qtvv",
        "uid": "3ef319f8-0aa0-4997-8d74-4b3e348871b5",
        "apiGroup": "certificates.k8s.io",
        "apiVersion": "v1",
        "resourceVersion": "1771386",
        "subresource": "status"
      },
      "responseStatus": {
        "metadata": {},
        "code": 200
      },
      "requestObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6qtvv",
          "generateName": "csr-",
          "uid": "3ef319f8-0aa0-4997-8d74-4b3e348871b5",
          "resourceVersion": "1771386",
          "creationTimestamp": "2023-08-19T13:31:10Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:10Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            },
            {
              "manager": "eks-certificates-controller",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:25Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:status": {
                  "f:conditions": {
                    ".": {},
                    "k:{\"type\":\"Approved\"}": {
                      ".": {},
                      "f:lastTransitionTime": {},
                      "f:lastUpdateTime": {},
                      "f:message": {},
                      "f:reason": {},
                      "f:status": {},
                      "f:type": {}
                    }
                  }
                }
              },
              "subresource": "approval"
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQnJ6Q0NBVlVDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBU3g0Uk45NHN5UkQxSDIKMVlqU01GZnBxeEk1aUdkWWRZbnRIZ1JBVjIxVzYraXlaTkZ4NDNKNlNvS2kzcER2TmdlVFk5eHh2RDBIelowbQpodjJJdkJyOG9JR1VNSUdSQmdrcWhraUc5dzBCQ1E0eGdZTXdnWUF3ZmdZRFZSMFJCSGN3ZFlJMVpXTXlMVEV6CkxUSXpNUzAwTVMweE15NWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1GdFlYcHZibUYzY3k1amIyMkMKTUdsd0xURTVNaTB4TmpndE56QXROelF1WVhBdGJtOXlkR2hsWVhOMExURXVZMjl0Y0hWMFpTNXBiblJsY201aApiSWNFRGVjcERZY0V3S2hHU2pBS0JnZ3Foa2pPUFFRREFnTklBREJGQWlBdDcyMTZxaVpFYTd5VWt6eWk4aXQvCjEvc1hvckF2SG1PbUdXcit4OC9sdVFJaEFQU1RIMlZHZFBtS0xBYVhSdjFTdkRwY29TVGszQk1vbWpQdmZtRTUKQ21WTAotLS0tLUVORCBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0K",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {
          "conditions": [
            {
              "type": "Approved",
              "status": "True",
              "reason": "AutoApproved",
              "message": "Auto approving self kubelet server certificate after SubjectAccessReview.",
              "lastUpdateTime": "2023-08-19T13:31:25Z",
              "lastTransitionTime": "2023-08-19T13:31:25Z"
            }
          ],
          "certificate": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURMVENDQWhXZ0F3SUJBZ0lVYjdQR2xpRHVWbXBsbEk3VkhDZ0twS0lVNyt3d0RRWUpLb1pJaHZjTkFRRUwKQlFBd0ZURVRNQkVHQTFVRUF4TUthM1ZpWlhKdVpYUmxjekFlRncweU16QTRNVGt4TXpJMk1EQmFGdzB5TkRBNApNVGd4TXpJMk1EQmFNRjR4RlRBVEJnTlZCQW9UREhONWMzUmxiVHB1YjJSbGN6RkZNRU1HQTFVRUF4TThjM2x6CmRHVnRPbTV2WkdVNmFYQXRNVGt5TFRFMk9DMDNNQzAzTkM1aGNDMXViM0owYUdWaGMzUXRNUzVqYjIxd2RYUmwKTG1sdWRHVnlibUZzTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFc2VFVGZlTE1rUTlSOXRXSQowakJYNmFzU09ZaG5XSFdKN1I0RVFGZHRWdXZvc21UUmNlTnlla3FDb3Q2UTd6WUhrMlBjY2J3OUI4MmRKb2I5CmlMd2EvS09COWpDQjh6QU9CZ05WSFE4QkFmOEVCQU1DQjRBd0V3WURWUjBsQkF3d0NnWUlLd1lCQlFVSEF3RXcKREFZRFZSMFRBUUgvQkFJd0FEQWRCZ05WSFE0RUZnUVVEQjJOdWtFaXpYWXg1VDdjekNyNjJrV21CVDh3SHdZRApWUjBqQkJnd0ZvQVVVNHhsTVdzWVpTUnBqQVUrREc1M2ZlNlZMK1l3ZmdZRFZSMFJCSGN3ZFlJMVpXTXlMVEV6CkxUSXpNUzAwTVMweE15NWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1GdFlYcHZibUYzY3k1amIyMkMKTUdsd0xURTVNaTB4TmpndE56QXROelF1WVhBdGJtOXlkR2hsWVhOMExURXVZMjl0Y0hWMFpTNXBiblJsY201aApiSWNFRGVjcERZY0V3S2hHU2pBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQWNPL2hDTk5BMEZtZWVsQXVWMEFTCmdMT0EvV0dPbTBaTGZQNnh2VEE5aDgrc1YyRThRYU0yR1BKUjVLWllkYURPcGhoRkNBWmM3YjkwM0ZhVkYyekMKaVBRMnNNTEw5TmxNd3JTNGtTZE9ySXJhZHRpdys4RVNjb3d0aGlRb3hJelNVZDZVNWNVcWhHMXRJYjQ0V3lyYwpzQmYrMVlxRXUwTDl5UmZNSzN0eG1UdjNnMXlUd0tqZWdXYU1ETEY2dmw4SWNBOFhVSjJlRCtVeDlpZmNoWHBCClBwdVdpamh5OHZzY2hwOHNiUVJyT0lGNW9vYWx1OWF1b0hWOVZUc2R5ZmZwMDc4b0piWmZGOWdOQjVpK0paZ1EKRDdrS3pvUFJ2RGk4QzZXY2NYL3lUSDgyK080NGtJaHRwZUJFMGlwRjh1ZGdSYXBOeVdCanZvQS8yN1YzdHh2aApQUT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
        }
      },
      "responseObject": {
        "kind": "CertificateSigningRequest",
        "apiVersion": "certificates.k8s.io/v1",
        "metadata": {
          "name": "csr-6qtvv",
          "generateName": "csr-",
          "uid": "3ef319f8-0aa0-4997-8d74-4b3e348871b5",
          "resourceVersion": "1771387",
          "creationTimestamp": "2023-08-19T13:31:10Z",
          "managedFields": [
            {
              "manager": "kubelet",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:10Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:metadata": {
                  "f:generateName": {}
                }
              }
            },
            {
              "manager": "eks-certificates-controller",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:25Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:status": {
                  "f:conditions": {
                    ".": {},
                    "k:{\"type\":\"Approved\"}": {
                      ".": {},
                      "f:lastTransitionTime": {},
                      "f:lastUpdateTime": {},
                      "f:message": {},
                      "f:reason": {},
                      "f:status": {},
                      "f:type": {}
                    }
                  }
                }
              },
              "subresource": "approval"
            },
            {
              "manager": "eks-certificates-controller",
              "operation": "Update",
              "apiVersion": "certificates.k8s.io/v1",
              "time": "2023-08-19T13:31:25Z",
              "fieldsType": "FieldsV1",
              "fieldsV1": {
                "f:status": {
                  "f:certificate": {}
                }
              },
              "subresource": "status"
            }
          ]
        },
        "spec": {
          "request": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQnJ6Q0NBVlVDQVFBd1hqRVZNQk1HQTFVRUNoTU1jM2x6ZEdWdE9tNXZaR1Z6TVVVd1F3WURWUVFERXp4egplWE4wWlcwNmJtOWtaVHBwY0MweE9USXRNVFk0TFRjd0xUYzBMbUZ3TFc1dmNuUm9aV0Z6ZEMweExtTnZiWEIxCmRHVXVhVzUwWlhKdVlXd3dXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBU3g0Uk45NHN5UkQxSDIKMVlqU01GZnBxeEk1aUdkWWRZbnRIZ1JBVjIxVzYraXlaTkZ4NDNKNlNvS2kzcER2TmdlVFk5eHh2RDBIelowbQpodjJJdkJyOG9JR1VNSUdSQmdrcWhraUc5dzBCQ1E0eGdZTXdnWUF3ZmdZRFZSMFJCSGN3ZFlJMVpXTXlMVEV6CkxUSXpNUzAwTVMweE15NWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1GdFlYcHZibUYzY3k1amIyMkMKTUdsd0xURTVNaTB4TmpndE56QXROelF1WVhBdGJtOXlkR2hsWVhOMExURXVZMjl0Y0hWMFpTNXBiblJsY201aApiSWNFRGVjcERZY0V3S2hHU2pBS0JnZ3Foa2pPUFFRREFnTklBREJGQWlBdDcyMTZxaVpFYTd5VWt6eWk4aXQvCjEvc1hvckF2SG1PbUdXcit4OC9sdVFJaEFQU1RIMlZHZFBtS0xBYVhSdjFTdkRwY29TVGszQk1vbWpQdmZtRTUKQ21WTAotLS0tLUVORCBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0K",
          "signerName": "kubernetes.io/kubelet-serving",
          "usages": [
            "digital signature",
            "server auth"
          ],
          "username": "system:node:ip-192-168-70-74.eu-west-1.compute.internal",
          "uid": "aws-iam-authenticator:111111111111:AROA5V3NJ2SQYVJIV4AKV",
          "groups": [
            "system:bootstrappers",
            "system:nodes",
            "system:authenticated"
          ],
          "extra": {
            "accessKeyId": [
              "ASIA5V3NJ2SQ5JHQAAGB"
            ],
            "arn": [
              "arn:aws:sts::111111111111:assumed-role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY/i-0e6c1f51d6dd34b3f"
            ],
            "canonicalArn": [
              "arn:aws:iam::111111111111:role/eksctl-ironman-nodegroup-ng1-publ-NodeInstanceRole-7OWCAPUILPFY"
            ],
            "principalId": [
              "AROA5V3NJ2SQYVJIV4AKV"
            ],
            "sessionName": [
              "i-0e6c1f51d6dd34b3f"
            ]
          }
        },
        "status": {
          "conditions": [
            {
              "type": "Approved",
              "status": "True",
              "reason": "AutoApproved",
              "message": "Auto approving self kubelet server certificate after SubjectAccessReview.",
              "lastUpdateTime": "2023-08-19T13:31:25Z",
              "lastTransitionTime": "2023-08-19T13:31:25Z"
            }
          ],
          "certificate": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURMVENDQWhXZ0F3SUJBZ0lVYjdQR2xpRHVWbXBsbEk3VkhDZ0twS0lVNyt3d0RRWUpLb1pJaHZjTkFRRUwKQlFBd0ZURVRNQkVHQTFVRUF4TUthM1ZpWlhKdVpYUmxjekFlRncweU16QTRNVGt4TXpJMk1EQmFGdzB5TkRBNApNVGd4TXpJMk1EQmFNRjR4RlRBVEJnTlZCQW9UREhONWMzUmxiVHB1YjJSbGN6RkZNRU1HQTFVRUF4TThjM2x6CmRHVnRPbTV2WkdVNmFYQXRNVGt5TFRFMk9DMDNNQzAzTkM1aGNDMXViM0owYUdWaGMzUXRNUzVqYjIxd2RYUmwKTG1sdWRHVnlibUZzTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFc2VFVGZlTE1rUTlSOXRXSQowakJYNmFzU09ZaG5XSFdKN1I0RVFGZHRWdXZvc21UUmNlTnlla3FDb3Q2UTd6WUhrMlBjY2J3OUI4MmRKb2I5CmlMd2EvS09COWpDQjh6QU9CZ05WSFE4QkFmOEVCQU1DQjRBd0V3WURWUjBsQkF3d0NnWUlLd1lCQlFVSEF3RXcKREFZRFZSMFRBUUgvQkFJd0FEQWRCZ05WSFE0RUZnUVVEQjJOdWtFaXpYWXg1VDdjekNyNjJrV21CVDh3SHdZRApWUjBqQkJnd0ZvQVVVNHhsTVdzWVpTUnBqQVUrREc1M2ZlNlZMK1l3ZmdZRFZSMFJCSGN3ZFlJMVpXTXlMVEV6CkxUSXpNUzAwTVMweE15NWhjQzF1YjNKMGFHVmhjM1F0TVM1amIyMXdkWFJsTG1GdFlYcHZibUYzY3k1amIyMkMKTUdsd0xURTVNaTB4TmpndE56QXROelF1WVhBdGJtOXlkR2hsWVhOMExURXVZMjl0Y0hWMFpTNXBiblJsY201aApiSWNFRGVjcERZY0V3S2hHU2pBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQWNPL2hDTk5BMEZtZWVsQXVWMEFTCmdMT0EvV0dPbTBaTGZQNnh2VEE5aDgrc1YyRThRYU0yR1BKUjVLWllkYURPcGhoRkNBWmM3YjkwM0ZhVkYyekMKaVBRMnNNTEw5TmxNd3JTNGtTZE9ySXJhZHRpdys4RVNjb3d0aGlRb3hJelNVZDZVNWNVcWhHMXRJYjQ0V3lyYwpzQmYrMVlxRXUwTDl5UmZNSzN0eG1UdjNnMXlUd0tqZWdXYU1ETEY2dmw4SWNBOFhVSjJlRCtVeDlpZmNoWHBCClBwdVdpamh5OHZzY2hwOHNiUVJyT0lGNW9vYWx1OWF1b0hWOVZUc2R5ZmZwMDc4b0piWmZGOWdOQjVpK0paZ1EKRDdrS3pvUFJ2RGk4QzZXY2NYL3lUSDgyK080NGtJaHRwZUJFMGlwRjh1ZGdSYXBOeVdCanZvQS8yN1YzdHh2aApQUT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
        }
      },
      "requestReceivedTimestamp": "2023-08-19T13:31:25.446438Z",
      "stageTimestamp": "2023-08-19T13:31:25.458206Z",
      "annotations": {
        "authorization.k8s.io/decision": "allow",
        "authorization.k8s.io/reason": "RBAC: allowed by ClusterRoleBinding \"eks:certificate-controller\" of ClusterRole \"system:controller:certificate-controller\" to User \"eks:certificate-controller\""
      }
    }
  }
]

```
